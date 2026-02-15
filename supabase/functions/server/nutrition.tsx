/**
 * Nutrition Tracking System
 * Tracks daily nutrition intake (calories, protein, carbs, fats)
 */

import * as kv from "./kv_store.tsx";

export interface NutritionEntry {
  id: string;
  userId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  recipeId?: string;
  recipeName?: string;
  createdAt: string; // ISO timestamp
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
 * Generate nutrition entry ID
 */
function generateNutritionId(userId: string, timestamp: number): string {
  return `nutrition:${userId}:${timestamp}`;
}

/**
 * Get date string in YYYY-MM-DD format
 */
function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Add nutrition entry when recipe is completed
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
  const timestamp = Date.now();
  const id = generateNutritionId(userId, timestamp);
  const date = getDateString();

  const entry: NutritionEntry = {
    id,
    userId,
    date,
    calories,
    protein,
    carbs,
    fats,
    recipeId,
    recipeName,
    createdAt: new Date().toISOString(),
  };

  await kv.set(id, entry);
  return entry;
}

/**
 * Get nutrition entries for a specific date
 */
export async function getEntriesByDate(userId: string, date: string): Promise<NutritionEntry[]> {
  const prefix = `nutrition:${userId}:`;
  const allEntries = await kv.getByPrefix<NutritionEntry>(prefix);
  
  return allEntries.filter(entry => entry.date === date);
}

/**
 * Get daily summary for a specific date
 */
export async function getDailySummary(userId: string, date: string): Promise<DailySummary> {
  const entries = await getEntriesByDate(userId, date);

  const summary: DailySummary = {
    date,
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    entries,
  };

  entries.forEach(entry => {
    summary.totalCalories += entry.calories;
    summary.totalProtein += entry.protein;
    summary.totalCarbs += entry.carbs;
    summary.totalFats += entry.fats;
  });

  return summary;
}

/**
 * Get weekly summary
 */
export async function getWeeklySummary(userId: string, weekStartDate?: string): Promise<WeeklySummary> {
  // If no week start provided, use current week (Monday)
  const today = weekStartDate ? new Date(weekStartDate) : new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
  const monday = new Date(today.setDate(diff));
  monday.setHours(0, 0, 0, 0);

  const weekStart = getDateString(monday);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const weekEnd = getDateString(sunday);

  // Get all entries for the user
  const prefix = `nutrition:${userId}:`;
  const allEntries = await kv.getByPrefix<NutritionEntry>(prefix);

  // Filter entries within the week
  const weekEntries = allEntries.filter(entry => {
    return entry.date >= weekStart && entry.date <= weekEnd;
  });

  // Group by date
  const entriesByDate: { [date: string]: NutritionEntry[] } = {};
  weekEntries.forEach(entry => {
    if (!entriesByDate[entry.date]) {
      entriesByDate[entry.date] = [];
    }
    entriesByDate[entry.date].push(entry);
  });

  // Create daily summaries
  const dailySummaries: DailySummary[] = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  // Generate summary for each day of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    const dateStr = getDateString(date);
    const entries = entriesByDate[dateStr] || [];

    const dailySummary: DailySummary = {
      date: dateStr,
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      entries,
    };

    entries.forEach(entry => {
      dailySummary.totalCalories += entry.calories;
      dailySummary.totalProtein += entry.protein;
      dailySummary.totalCarbs += entry.carbs;
      dailySummary.totalFats += entry.fats;
    });

    totalCalories += dailySummary.totalCalories;
    totalProtein += dailySummary.totalProtein;
    totalCarbs += dailySummary.totalCarbs;
    totalFats += dailySummary.totalFats;

    dailySummaries.push(dailySummary);
  }

  const daysWithData = dailySummaries.filter(d => d.entries.length > 0).length || 1;

  return {
    weekStart,
    weekEnd,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    dailySummaries,
    averageDaily: {
      calories: Math.round(totalCalories / daysWithData),
      protein: Math.round(totalProtein / daysWithData),
      carbs: Math.round(totalCarbs / daysWithData),
      fats: Math.round(totalFats / daysWithData),
    },
  };
}

/**
 * Delete nutrition entry
 */
export async function deleteNutritionEntry(userId: string, entryId: string): Promise<void> {
  // Verify entry belongs to user
  const entry = await kv.get<NutritionEntry>(entryId);
  if (!entry || entry.userId !== userId) {
    throw new Error('Entry not found or unauthorized');
  }

  await kv.del(entryId);
}
