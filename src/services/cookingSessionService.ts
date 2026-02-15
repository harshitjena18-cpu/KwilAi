/**
 * Cooking Session Service
 * Frontend service for managing cooking sessions
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1bfecde`;

export interface CookingSession {
  id: string;
  userId: string;
  recipeId: string;
  recipeName: string;
  totalSteps: number;
  currentStep: number;
  startedAt: string;
  completedAt?: string;
  completed: boolean;
  lastUpdated: string;
}

export interface CookingStats {
  totalSessions: number;
  completedSessions: number;
  activeSessions: number;
  completionRate: number;
  totalCookingTime: number;
  averageCookingTime: number;
}

/**
 * Start a new cooking session
 */
export async function startCookingSession(
  userId: string,
  recipeId: string,
  recipeName: string,
  totalSteps: number
): Promise<CookingSession> {
  const response = await fetch(`${API_URL}/cooking/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({
      userId,
      recipeId,
      recipeName,
      totalSteps,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to start cooking session');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Get active session for a recipe
 */
export async function getActiveSession(userId: string, recipeId: string): Promise<CookingSession | null> {
  const response = await fetch(`${API_URL}/cooking/active/${userId}/${recipeId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get active session');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<CookingSession> {
  const response = await fetch(`${API_URL}/cooking/session/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get session');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Get all user sessions
 */
export async function getUserSessions(userId: string, includeCompleted: boolean = true): Promise<CookingSession[]> {
  const url = `${API_URL}/cooking/sessions/${userId}?includeCompleted=${includeCompleted}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user sessions');
  }

  const data = await response.json();
  return data.sessions;
}

/**
 * Move to next step
 */
export async function nextStep(userId: string, sessionId: string): Promise<CookingSession> {
  const response = await fetch(`${API_URL}/cooking/next`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId, sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to move to next step');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Move to previous step
 */
export async function previousStep(userId: string, sessionId: string): Promise<CookingSession> {
  const response = await fetch(`${API_URL}/cooking/previous`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId, sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to move to previous step');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Go to specific step
 */
export async function goToStep(userId: string, sessionId: string, stepIndex: number): Promise<CookingSession> {
  const response = await fetch(`${API_URL}/cooking/goto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId, sessionId, stepIndex }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to go to step');
  }

  const data = await response.json();
  return data.session;
}

/**
 * Finish cooking session and optionally add nutrition
 */
export async function finishCookingSession(
  userId: string,
  sessionId: string,
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }
): Promise<{ session: CookingSession; nutritionEntry: any }> {
  const response = await fetch(`${API_URL}/cooking/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ userId, sessionId, nutrition }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to finish cooking session');
  }

  const data = await response.json();
  return { session: data.session, nutritionEntry: data.nutritionEntry };
}

/**
 * Delete/cancel cooking session
 */
export async function deleteCookingSession(userId: string, sessionId: string): Promise<void> {
  const response = await fetch(`${API_URL}/cooking/session/${userId}/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete cooking session');
  }
}

/**
 * Get cooking statistics
 */
export async function getCookingStats(userId: string): Promise<CookingStats> {
  const response = await fetch(`${API_URL}/cooking/stats/${userId}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get cooking stats');
  }

  const data = await response.json();
  return data.stats;
}

/**
 * Format cooking time from milliseconds to readable string
 */
export function formatCookingTime(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}

export default {
  startCookingSession,
  getActiveSession,
  getSession,
  getUserSessions,
  nextStep,
  previousStep,
  goToStep,
  finishCookingSession,
  deleteCookingSession,
  getCookingStats,
  formatCookingTime,
};
