/**
 * Nutrition Tracking Service
 * Frontend service for managing nutrition data
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-d1bfecde`;

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recipeId?: string;
  recipeName?: string;
  createdAt: string;
}

export interface DailySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  entries: NutritionEntry[];
}

export interface WeeklySummary {
  weekStart: string;
  weekEnd: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  dailySummaries: DailySummary[];
  averageDaily: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

/**
 * Add nutrition entry
 */
export async function addNutritionEntry(
  userId: string,
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
  recipeId?: string,
  recipeName?: string
): Promise<NutritionEntry> {
  const response = await fetch(`${API_URL}/nutrition`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({
      userId,
      calories,
      protein,
      carbs,
      fats,
      recipeId,
      recipeName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add nutrition entry');
  }

  const data = await response.json();
  return data.entry;
}

/**
 * Get daily nutrition summary
 */
export async function getDailySummary(userId: string, date: string): Promise<DailySummary> {
  const response = await fetch(`${API_URL}/nutrition/daily/${userId}/${date}`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get daily summary');
  }

  const data = await response.json();
  return data.summary;
}

/**
 * Get weekly nutrition summary
 */
export async function getWeeklySummary(userId: string, weekStart?: string): Promise<WeeklySummary> {
  const url = weekStart 
    ? `${API_URL}/nutrition/weekly/${userId}?weekStart=${weekStart}`
    : `${API_URL}/nutrition/weekly/${userId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get weekly summary');
  }

  const data = await response.json();
  return data.summary;
}

/**
 * Delete nutrition entry
 */
export async function deleteNutritionEntry(userId: string, entryId: string): Promise<void> {
  const response = await fetch(`${API_URL}/nutrition/${userId}/${entryId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete nutrition entry');
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default {
  addNutritionEntry,
  getDailySummary,
  getWeeklySummary,
  deleteNutritionEntry,
  getTodayDateString,
  formatDate,
};
