/**
 * Plan Management System
 * Handles Free/Pro plan limits and usage tracking
 */

import * as kv from "./kv_store.tsx";

export enum PlanType {
  FREE = 'free',
  PRO = 'pro'
}

export interface UserPlan {
  userId: string;
  plan: PlanType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  updatedAt: string;
  createdAt: string;
}

export interface DailyUsage {
  userId: string;
  date: string; // YYYY-MM-DD
  scans: number;
  aiGenerations: number;
  updatedAt: string;
}

// Plan limits
export const PLAN_LIMITS = {
  [PlanType.FREE]: {
    scansPerDay: 5,
    aiGenerationsPerDay: 5,
  },
  [PlanType.PRO]: {
    scansPerDay: Infinity,
    aiGenerationsPerDay: Infinity,
  },
};

/**
 * Get user's plan
 */
export async function getUserPlan(userId: string): Promise<UserPlan> {
  const key = `plan:${userId}`;
  const plan = await kv.get<UserPlan>(key);
  
  if (!plan) {
    // Default to free plan
    const defaultPlan: UserPlan = {
      userId,
      plan: PlanType.FREE,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await kv.set(key, defaultPlan);
    return defaultPlan;
  }
  
  return plan;
}

/**
 * Update user's plan
 */
export async function updateUserPlan(
  userId: string,
  planType: PlanType,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  subscriptionStatus?: 'active' | 'canceled' | 'past_due'
): Promise<UserPlan> {
  const key = `plan:${userId}`;
  const existingPlan = await getUserPlan(userId);
  
  const updatedPlan: UserPlan = {
    ...existingPlan,
    plan: planType,
    stripeCustomerId: stripeCustomerId || existingPlan.stripeCustomerId,
    stripeSubscriptionId: stripeSubscriptionId || existingPlan.stripeSubscriptionId,
    subscriptionStatus: subscriptionStatus || existingPlan.subscriptionStatus,
    updatedAt: new Date().toISOString(),
  };
  
  await kv.set(key, updatedPlan);
  return updatedPlan;
}

/**
 * Get today's date string
 */
function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get daily usage key
 */
function getDailyUsageKey(userId: string, date: string): string {
  return `usage:${userId}:${date}`;
}

/**
 * Get daily usage
 */
export async function getDailyUsage(userId: string, date?: string): Promise<DailyUsage> {
  const targetDate = date || getTodayDateString();
  const key = getDailyUsageKey(userId, targetDate);
  const usage = await kv.get<DailyUsage>(key);
  
  if (!usage) {
    const defaultUsage: DailyUsage = {
      userId,
      date: targetDate,
      scans: 0,
      aiGenerations: 0,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(key, defaultUsage);
    return defaultUsage;
  }
  
  return usage;
}

/**
 * Increment scan count
 */
export async function incrementScans(userId: string): Promise<DailyUsage> {
  const today = getTodayDateString();
  const usage = await getDailyUsage(userId, today);
  
  usage.scans += 1;
  usage.updatedAt = new Date().toISOString();
  
  const key = getDailyUsageKey(userId, today);
  await kv.set(key, usage);
  
  return usage;
}

/**
 * Increment AI generation count
 */
export async function incrementAIGenerations(userId: string): Promise<DailyUsage> {
  const today = getTodayDateString();
  const usage = await getDailyUsage(userId, today);
  
  usage.aiGenerations += 1;
  usage.updatedAt = new Date().toISOString();
  
  const key = getDailyUsageKey(userId, today);
  await kv.set(key, usage);
  
  return usage;
}

/**
 * Check if user can perform scan
 */
export async function canPerformScan(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const plan = await getUserPlan(userId);
  const usage = await getDailyUsage(userId);
  const limit = PLAN_LIMITS[plan.plan].scansPerDay;
  
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }
  
  const remaining = Math.max(0, limit - usage.scans);
  return {
    allowed: usage.scans < limit,
    remaining,
    limit,
  };
}

/**
 * Check if user can perform AI generation
 */
export async function canPerformAIGeneration(userId: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const plan = await getUserPlan(userId);
  const usage = await getDailyUsage(userId);
  const limit = PLAN_LIMITS[plan.plan].aiGenerationsPerDay;
  
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit: Infinity };
  }
  
  const remaining = Math.max(0, limit - usage.aiGenerations);
  return {
    allowed: usage.aiGenerations < limit,
    remaining,
    limit,
  };
}

/**
 * Get usage summary for user
 */
export async function getUsageSummary(userId: string) {
  const plan = await getUserPlan(userId);
  const usage = await getDailyUsage(userId);
  const limits = PLAN_LIMITS[plan.plan];
  
  return {
    plan: plan.plan,
    subscriptionStatus: plan.subscriptionStatus,
    today: {
      scans: {
        used: usage.scans,
        limit: limits.scansPerDay,
        remaining: limits.scansPerDay === Infinity ? Infinity : Math.max(0, limits.scansPerDay - usage.scans),
      },
      aiGenerations: {
        used: usage.aiGenerations,
        limit: limits.aiGenerationsPerDay,
        remaining: limits.aiGenerationsPerDay === Infinity ? Infinity : Math.max(0, limits.aiGenerationsPerDay - usage.aiGenerations),
      },
    },
  };
}

/**
 * Reset daily usage (called by cron or manually)
 */
export async function resetDailyUsage(userId: string, date: string): Promise<void> {
  const key = getDailyUsageKey(userId, date);
  await kv.del(key);
}

/**
 * Get historical usage for analytics
 */
export async function getHistoricalUsage(userId: string, startDate: string, endDate: string): Promise<DailyUsage[]> {
  const prefix = `usage:${userId}:`;
  const allUsage = await kv.getByPrefix<DailyUsage>(prefix);
  
  return allUsage.filter(usage => {
    return usage.date >= startDate && usage.date <= endDate;
  }).sort((a, b) => a.date.localeCompare(b.date));
}
