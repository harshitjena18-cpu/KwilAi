/**
 * Cooking Session Manager
 * Manages cooking sessions with step tracking and progress storage
 */

import * as kv from "./kv_store.tsx";

export interface CookingSession {
  id: string;
  userId: string;
  recipeId: string;
  recipeName: string;
  totalSteps: number;
  currentStep: number;
  startedAt: string; // ISO timestamp
  completedAt?: string; // ISO timestamp
  completed: boolean;
  lastUpdated: string; // ISO timestamp
}

export interface Recipe {
  id: string;
  name: string;
  steps?: string[];
  totalSteps?: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

/**
 * Generate session ID
 */
function generateSessionId(userId: string, timestamp: number): string {
  return `session:${userId}:${timestamp}`;
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
  // Check if there's an active session for this recipe
  const existingSession = await getActiveSession(userId, recipeId);
  if (existingSession) {
    // Resume existing session
    return existingSession;
  }

  const timestamp = Date.now();
  const id = generateSessionId(userId, timestamp);

  const session: CookingSession = {
    id,
    userId,
    recipeId,
    recipeName,
    totalSteps,
    currentStep: 0,
    startedAt: new Date().toISOString(),
    completed: false,
    lastUpdated: new Date().toISOString(),
  };

  await kv.set(id, session);
  return session;
}

/**
 * Get active (incomplete) session for a recipe
 */
export async function getActiveSession(userId: string, recipeId: string): Promise<CookingSession | null> {
  const prefix = `session:${userId}:`;
  const allSessions = await kv.getByPrefix<CookingSession>(prefix);
  
  const activeSessions = allSessions.filter(
    session => session.recipeId === recipeId && !session.completed
  );

  // Return the most recent active session
  if (activeSessions.length > 0) {
    activeSessions.sort((a, b) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    return activeSessions[0];
  }

  return null;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<CookingSession | null> {
  return await kv.get<CookingSession>(sessionId);
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId: string, includeCompleted: boolean = true): Promise<CookingSession[]> {
  const prefix = `session:${userId}:`;
  const allSessions = await kv.getByPrefix<CookingSession>(prefix);
  
  if (!includeCompleted) {
    return allSessions.filter(session => !session.completed);
  }

  // Sort by most recent first
  return allSessions.sort((a, b) => 
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
}

/**
 * Move to next step
 */
export async function nextStep(userId: string, sessionId: string): Promise<CookingSession> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (session.completed) {
    throw new Error('Session already completed');
  }

  if (session.currentStep >= session.totalSteps - 1) {
    throw new Error('Already at last step');
  }

  session.currentStep += 1;
  session.lastUpdated = new Date().toISOString();

  await kv.set(sessionId, session);
  return session;
}

/**
 * Move to previous step
 */
export async function previousStep(userId: string, sessionId: string): Promise<CookingSession> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (session.currentStep <= 0) {
    throw new Error('Already at first step');
  }

  session.currentStep -= 1;
  session.lastUpdated = new Date().toISOString();

  await kv.set(sessionId, session);
  return session;
}

/**
 * Jump to a specific step
 */
export async function goToStep(userId: string, sessionId: string, stepIndex: number): Promise<CookingSession> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (session.completed) {
    throw new Error('Session already completed');
  }

  if (stepIndex < 0 || stepIndex >= session.totalSteps) {
    throw new Error('Invalid step index');
  }

  session.currentStep = stepIndex;
  session.lastUpdated = new Date().toISOString();

  await kv.set(sessionId, session);
  return session;
}

/**
 * Finish cooking session
 */
export async function finishCookingSession(
  userId: string,
  sessionId: string
): Promise<CookingSession> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  if (session.completed) {
    throw new Error('Session already completed');
  }

  session.completed = true;
  session.completedAt = new Date().toISOString();
  session.lastUpdated = new Date().toISOString();
  session.currentStep = session.totalSteps; // Mark as finished

  await kv.set(sessionId, session);
  return session;
}

/**
 * Delete/cancel a cooking session
 */
export async function deleteCookingSession(userId: string, sessionId: string): Promise<void> {
  const session = await getSession(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }

  if (session.userId !== userId) {
    throw new Error('Unauthorized');
  }

  await kv.del(sessionId);
}

/**
 * Get cooking statistics for a user
 */
export async function getCookingStats(userId: string): Promise<{
  totalSessions: number;
  completedSessions: number;
  activeSessions: number;
  completionRate: number;
  totalCookingTime: number; // in milliseconds
  averageCookingTime: number; // in milliseconds
}> {
  const allSessions = await getUserSessions(userId, true);
  const completedSessions = allSessions.filter(s => s.completed);
  const activeSessions = allSessions.filter(s => !s.completed);

  let totalCookingTime = 0;
  completedSessions.forEach(session => {
    if (session.completedAt) {
      const duration = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime();
      totalCookingTime += duration;
    }
  });

  return {
    totalSessions: allSessions.length,
    completedSessions: completedSessions.length,
    activeSessions: activeSessions.length,
    completionRate: allSessions.length > 0 ? (completedSessions.length / allSessions.length) * 100 : 0,
    totalCookingTime,
    averageCookingTime: completedSessions.length > 0 ? totalCookingTime / completedSessions.length : 0,
  };
}
