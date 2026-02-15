/**
 * Rate Limiting
 * Prevents API abuse with request rate limits
 */

import * as kv from "./kv_store.tsx";

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

export interface RateLimitInfo {
  key: string;
  count: number;
  resetAt: number;  // Timestamp
  createdAt: number;  // Timestamp
}

// Default rate limit configurations
export const RATE_LIMITS = {
  // General API requests
  general: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60,  // 60 requests per minute
  },
  
  // Image scanning (more restrictive)
  scan: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10,  // 10 scans per minute
  },
  
  // AI generation (most restrictive)
  aiGeneration: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 5,  // 5 AI requests per minute
  },
  
  // Authentication attempts
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5,  // 5 attempts per 15 minutes
  },
  
  // Stripe/payment operations
  payment: {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10,  // 10 payment requests per minute
  },
};

/**
 * Generate rate limit key
 */
function getRateLimitKey(identifier: string, type: string): string {
  return `ratelimit:${type}:${identifier}`;
}

/**
 * Check rate limit
 */
export async function checkRateLimit(
  identifier: string,  // User ID or IP address
  type: keyof typeof RATE_LIMITS
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}> {
  const config = RATE_LIMITS[type];
  const key = getRateLimitKey(identifier, type);
  const now = Date.now();

  // Get current rate limit info
  let limitInfo = await kv.get<RateLimitInfo>(key);

  // If no record or expired, create new one
  if (!limitInfo || now > limitInfo.resetAt) {
    limitInfo = {
      key,
      count: 0,
      resetAt: now + config.windowMs,
      createdAt: now,
    };
  }

  // Check if limit exceeded
  if (limitInfo.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: limitInfo.resetAt,
      retryAfter: Math.ceil((limitInfo.resetAt - now) / 1000),  // seconds
    };
  }

  // Increment count
  limitInfo.count += 1;
  await kv.set(key, limitInfo);

  return {
    allowed: true,
    remaining: config.maxRequests - limitInfo.count,
    resetAt: limitInfo.resetAt,
  };
}

/**
 * Reset rate limit for a user (admin function)
 */
export async function resetRateLimit(identifier: string, type: string): Promise<void> {
  const key = getRateLimitKey(identifier, type);
  await kv.del(key);
}

/**
 * Get current rate limit status
 */
export async function getRateLimitStatus(
  identifier: string,
  type: keyof typeof RATE_LIMITS
): Promise<{
  count: number;
  limit: number;
  remaining: number;
  resetAt: number;
}> {
  const config = RATE_LIMITS[type];
  const key = getRateLimitKey(identifier, type);
  const now = Date.now();

  const limitInfo = await kv.get<RateLimitInfo>(key);

  if (!limitInfo || now > limitInfo.resetAt) {
    return {
      count: 0,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetAt: now + config.windowMs,
    };
  }

  return {
    count: limitInfo.count,
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - limitInfo.count),
    resetAt: limitInfo.resetAt,
  };
}

/**
 * Rate limit middleware for Hono
 */
export function rateLimitMiddleware(type: keyof typeof RATE_LIMITS) {
  return async (c: any, next: () => Promise<void>) => {
    // Get identifier (user ID from header or IP)
    const userId = c.req.header('X-User-Id');
    const ip = c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown';
    const identifier = userId || ip;

    // Check rate limit
    const result = await checkRateLimit(identifier, type);

    // Add rate limit headers
    c.header('X-RateLimit-Limit', RATE_LIMITS[type].maxRequests.toString());
    c.header('X-RateLimit-Remaining', result.remaining.toString());
    c.header('X-RateLimit-Reset', result.resetAt.toString());

    if (!result.allowed) {
      c.header('Retry-After', result.retryAfter?.toString() || '60');
      return c.json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Please try again in ${result.retryAfter} seconds.`,
        retryAfter: result.retryAfter,
        resetAt: result.resetAt,
      }, 429);
    }

    await next();
  };
}

/**
 * Cleanup old rate limit records (run periodically)
 */
export async function cleanupOldRateLimits(): Promise<number> {
  const prefix = 'ratelimit:';
  const allLimits = await kv.getByPrefix<RateLimitInfo>(prefix);
  const now = Date.now();
  let cleaned = 0;

  for (const limit of allLimits) {
    if (now > limit.resetAt + (24 * 60 * 60 * 1000)) {  // Older than 24 hours
      await kv.del(limit.key);
      cleaned++;
    }
  }

  console.log(`Cleaned up ${cleaned} old rate limit records`);
  return cleaned;
}

export default {
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
  rateLimitMiddleware,
  cleanupOldRateLimits,
};
