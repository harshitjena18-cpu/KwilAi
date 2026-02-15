/**
 * Plan Management Service
 * Frontend service for managing user plans and subscriptions
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1bfecde`;

export type PlanType = 'free' | 'pro';

export interface UsageSummary {
  plan: PlanType;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  today: {
    scans: {
      used: number;
      limit: number;
      remaining: number;
    };
    aiGenerations: {
      used: number;
      limit: number;
      remaining: number;
    };
  };
}

export interface CanPerformResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export interface DailyUsage {
  userId: string;
  date: string;
  scans: number;
  aiGenerations: number;
  updatedAt: string;
}

/**
 * Get user plan and usage summary
 */
export async function getPlanSummary(userId: string): Promise<UsageSummary> {
  const response = await fetch(`${API_URL}/plan/${userId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get plan summary');
  }

  const data = await response.json();
  return {
    plan: data.plan,
    subscriptionStatus: data.subscriptionStatus,
    today: data.today,
  };
}

/**
 * Check if user can perform a scan
 */
export async function canScan(userId: string): Promise<CanPerformResult> {
  const response = await fetch(`${API_URL}/plan/${userId}/can-scan`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check scan permission');
  }

  const data = await response.json();
  return { allowed: data.allowed, remaining: data.remaining, limit: data.limit };
}

/**
 * Check if user can perform AI generation
 */
export async function canGenerate(userId: string): Promise<CanPerformResult> {
  const response = await fetch(`${API_URL}/plan/${userId}/can-generate`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to check generation permission');
  }

  const data = await response.json();
  return { allowed: data.allowed, remaining: data.remaining, limit: data.limit };
}

/**
 * Record a scan usage
 */
export async function recordScan(userId: string): Promise<{ scansUsed: number; remaining: number; limit: number }> {
  const response = await fetch(`${API_URL}/plan/${userId}/use-scan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 429) {
      throw new Error(`LIMIT_REACHED:${error.plan || 'free'}`);
    }
    throw new Error(error.error || 'Failed to record scan');
  }

  return await response.json();
}

/**
 * Record an AI generation usage
 */
export async function recordGeneration(userId: string): Promise<{ generationsUsed: number; remaining: number; limit: number }> {
  const response = await fetch(`${API_URL}/plan/${userId}/use-generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 429) {
      throw new Error(`LIMIT_REACHED:${error.plan || 'free'}`);
    }
    throw new Error(error.error || 'Failed to record generation');
  }

  return await response.json();
}

/**
 * Create Stripe checkout session for Pro upgrade
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  name?: string
): Promise<{ sessionId: string; url: string }> {
  const response = await fetch(`${API_URL}/stripe/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId, email, name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  const data = await response.json();
  return { sessionId: data.sessionId, url: data.url };
}

/**
 * Create Stripe customer portal session
 */
export async function createPortalSession(userId: string): Promise<{ url: string }> {
  const response = await fetch(`${API_URL}/stripe/portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create portal session');
  }

  const data = await response.json();
  return { url: data.url };
}

/**
 * Get subscription info
 */
export async function getSubscriptionInfo(userId: string): Promise<any> {
  const response = await fetch(`${API_URL}/stripe/subscription/${userId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get subscription info');
  }

  const data = await response.json();
  return data.subscription;
}

/**
 * Get usage history
 */
export async function getUsageHistory(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<DailyUsage[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const response = await fetch(`${API_URL}/plan/${userId}/history?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get usage history');
  }

  const data = await response.json();
  return data.history;
}

export default {
  getPlanSummary,
  canScan,
  canGenerate,
  recordScan,
  recordGeneration,
  createCheckoutSession,
  createPortalSession,
  getSubscriptionInfo,
  getUsageHistory,
};
