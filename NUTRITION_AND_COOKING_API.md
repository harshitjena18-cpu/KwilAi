# Nutrition Tracking & Cooking Session API Documentation

## Overview

This document describes the **Nutrition Tracking** and **Cooking Session Management** systems for Kwil AI.

---

## 🥗 Nutrition Tracking System

Track user nutrition when recipes are completed. Automatically logs calories, protein, carbs, and fats.

### Data Models

#### NutritionEntry
```typescript
{
  id: string;              // Unique ID: nutrition:userId:timestamp
  userId: string;          // User identifier
  date: string;            // ISO date (YYYY-MM-DD)
  calories: number;        // Calories consumed
  protein: number;         // Protein in grams
  carbs: number;           // Carbs in grams
  fats: number;            // Fats in grams
  recipeId?: string;       // Optional recipe ID
  recipeName?: string;     // Optional recipe name
  createdAt: string;       // ISO timestamp
}
```

#### WeeklySummary
```typescript
{
  weekStart: string;       // Monday date (YYYY-MM-DD)
  weekEnd: string;         // Sunday date (YYYY-MM-DD)
  totalCalories: number;   // Total for the week
  totalProtein: number;    // Total protein for the week
  totalCarbs: number;      // Total carbs for the week
  totalFats: number;       // Total fats for the week
  dailySummaries: Array<{  // 7 days of data
    date: string;
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
    entries: NutritionEntry[];
  }>;
  averageDaily: {          // Average per day
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}
```

### API Endpoints

#### 1. Add Nutrition Entry
```
POST /make-server-d1bfecde/nutrition
```

**Request Body:**
```json
{
  "userId": "user123",
  "calories": 450,
  "protein": 25,
  "carbs": 45,
  "fats": 15,
  "recipeId": "recipe456",      // Optional
  "recipeName": "Chicken Salad" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "entry": {
    "id": "nutrition:user123:1234567890",
    "userId": "user123",
    "date": "2026-02-15",
    "calories": 450,
    "protein": 25,
    "carbs": 45,
    "fats": 15,
    "recipeId": "recipe456",
    "recipeName": "Chicken Salad",
    "createdAt": "2026-02-15T10:30:00.000Z"
  }
}
```

#### 2. Get Daily Summary
```
GET /make-server-d1bfecde/nutrition/daily/:userId/:date
```

**Example:**
```
GET /make-server-d1bfecde/nutrition/daily/user123/2026-02-15
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "date": "2026-02-15",
    "totalCalories": 1850,
    "totalProtein": 95,
    "totalCarbs": 180,
    "totalFats": 65,
    "entries": [...]
  }
}
```

#### 3. Get Weekly Summary
```
GET /make-server-d1bfecde/nutrition/weekly/:userId?weekStart=YYYY-MM-DD
```

**Example:**
```
GET /make-server-d1bfecde/nutrition/weekly/user123
GET /make-server-d1bfecde/nutrition/weekly/user123?weekStart=2026-02-10
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "weekStart": "2026-02-10",
    "weekEnd": "2026-02-16",
    "totalCalories": 12950,
    "totalProtein": 665,
    "totalCarbs": 1260,
    "totalFats": 455,
    "dailySummaries": [...],
    "averageDaily": {
      "calories": 1850,
      "protein": 95,
      "carbs": 180,
      "fats": 65
    }
  }
}
```

#### 4. Delete Nutrition Entry
```
DELETE /make-server-d1bfecde/nutrition/:userId/:entryId
```

**Example:**
```
DELETE /make-server-d1bfecde/nutrition/user123/nutrition:user123:1234567890
```

---

## 👨‍🍳 Cooking Session Management

Track cooking progress with step-by-step navigation and automatic completion.

### Data Models

#### CookingSession
```typescript
{
  id: string;              // Unique ID: session:userId:timestamp
  userId: string;          // User identifier
  recipeId: string;        // Recipe being cooked
  recipeName: string;      // Recipe name
  totalSteps: number;      // Total number of steps
  currentStep: number;     // Current step (0-based index)
  startedAt: string;       // ISO timestamp
  completedAt?: string;    // ISO timestamp (when completed)
  completed: boolean;      // Completion status
  lastUpdated: string;     // ISO timestamp
}
```

### API Endpoints

#### 1. Start Cooking Session
```
POST /make-server-d1bfecde/cooking/start
```

**Request Body:**
```json
{
  "userId": "user123",
  "recipeId": "recipe456",
  "recipeName": "Chicken Salad",
  "totalSteps": 8
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "id": "session:user123:1234567890",
    "userId": "user123",
    "recipeId": "recipe456",
    "recipeName": "Chicken Salad",
    "totalSteps": 8,
    "currentStep": 0,
    "startedAt": "2026-02-15T10:00:00.000Z",
    "completed": false,
    "lastUpdated": "2026-02-15T10:00:00.000Z"
  }
}
```

**Note:** If an active session exists for this recipe, it will be resumed instead of creating a new one.

#### 2. Get Active Session
```
GET /make-server-d1bfecde/cooking/active/:userId/:recipeId
```

**Example:**
```
GET /make-server-d1bfecde/cooking/active/user123/recipe456
```

**Response:**
```json
{
  "success": true,
  "session": { ... } // or null if no active session
}
```

#### 3. Get Session by ID
```
GET /make-server-d1bfecde/cooking/session/:sessionId
```

#### 4. Get All User Sessions
```
GET /make-server-d1bfecde/cooking/sessions/:userId?includeCompleted=true
```

**Query Parameters:**
- `includeCompleted`: Set to `false` to get only active sessions

#### 5. Next Step
```
POST /make-server-d1bfecde/cooking/next
```

**Request Body:**
```json
{
  "userId": "user123",
  "sessionId": "session:user123:1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "currentStep": 1, // Incremented
    "lastUpdated": "2026-02-15T10:05:00.000Z"
  }
}
```

#### 6. Previous Step
```
POST /make-server-d1bfecde/cooking/previous
```

**Request Body:**
```json
{
  "userId": "user123",
  "sessionId": "session:user123:1234567890"
}
```

#### 7. Go to Specific Step
```
POST /make-server-d1bfecde/cooking/goto
```

**Request Body:**
```json
{
  "userId": "user123",
  "sessionId": "session:user123:1234567890",
  "stepIndex": 3
}
```

#### 8. Finish Cooking Session
```
POST /make-server-d1bfecde/cooking/finish
```

**Request Body:**
```json
{
  "userId": "user123",
  "sessionId": "session:user123:1234567890",
  "nutrition": {           // Optional - auto-logs nutrition
    "calories": 450,
    "protein": 25,
    "carbs": 45,
    "fats": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "completed": true,
    "completedAt": "2026-02-15T10:30:00.000Z",
    "currentStep": 8
  },
  "nutritionEntry": {      // Only if nutrition provided
    "id": "nutrition:user123:...",
    "calories": 450,
    ...
  }
}
```

#### 9. Delete/Cancel Session
```
DELETE /make-server-d1bfecde/cooking/session/:userId/:sessionId
```

#### 10. Get Cooking Statistics
```
GET /make-server-d1bfecde/cooking/stats/:userId
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSessions": 45,
    "completedSessions": 38,
    "activeSessions": 7,
    "completionRate": 84.4,
    "totalCookingTime": 3600000,    // in milliseconds
    "averageCookingTime": 94736     // in milliseconds
  }
}
```

---

## 🔧 Frontend Usage Examples

### Nutrition Tracking

```typescript
import nutritionService from '/src/services/nutritionService';

// When recipe is completed
await nutritionService.addNutritionEntry(
  'user123',
  450,  // calories
  25,   // protein
  45,   // carbs
  15,   // fats
  'recipe456',
  'Chicken Salad'
);

// Get today's nutrition
const today = nutritionService.getTodayDateString();
const dailySummary = await nutritionService.getDailySummary('user123', today);

// Get weekly summary
const weeklySummary = await nutritionService.getWeeklySummary('user123');
```

### Cooking Session

```typescript
import cookingSessionService from '/src/services/cookingSessionService';

// Start cooking
const session = await cookingSessionService.startCookingSession(
  'user123',
  'recipe456',
  'Chicken Salad',
  8  // total steps
);

// Navigate steps
await cookingSessionService.nextStep('user123', session.id);
await cookingSessionService.previousStep('user123', session.id);
await cookingSessionService.goToStep('user123', session.id, 3);

// Finish and log nutrition
await cookingSessionService.finishCookingSession(
  'user123',
  session.id,
  {
    calories: 450,
    protein: 25,
    carbs: 45,
    fats: 15
  }
);

// Get stats
const stats = await cookingSessionService.getCookingStats('user123');
console.log(`Completion rate: ${stats.completionRate}%`);
```

---

## 🎯 Common Use Cases

### 1. Complete Recipe Flow
```typescript
// 1. Start cooking
const session = await startCookingSession(userId, recipeId, recipeName, totalSteps);

// 2. Navigate through steps
for (let i = 0; i < totalSteps; i++) {
  // User completes step
  await nextStep(userId, session.id);
}

// 3. Finish and log nutrition
await finishCookingSession(userId, session.id, {
  calories: recipe.nutrition.calories,
  protein: recipe.nutrition.protein,
  carbs: recipe.nutrition.carbs,
  fats: recipe.nutrition.fats
});
```

### 2. Resume Interrupted Cooking
```typescript
// Check for existing session
const activeSession = await getActiveSession(userId, recipeId);

if (activeSession) {
  // Resume from where they left off
  console.log(`Resume from step ${activeSession.currentStep}`);
} else {
  // Start new session
  const session = await startCookingSession(...);
}
```

### 3. Daily Nutrition Dashboard
```typescript
const today = getTodayDateString();
const summary = await getDailySummary(userId, today);

console.log(`Today's intake:`);
console.log(`Calories: ${summary.totalCalories}`);
console.log(`Protein: ${summary.totalProtein}g`);
console.log(`Carbs: ${summary.totalCarbs}g`);
console.log(`Fats: ${summary.totalFats}g`);
```

### 4. Weekly Progress Report
```typescript
const weeklySummary = await getWeeklySummary(userId);

console.log(`Week: ${weeklySummary.weekStart} to ${weeklySummary.weekEnd}`);
console.log(`Total calories: ${weeklySummary.totalCalories}`);
console.log(`Average daily: ${weeklySummary.averageDaily.calories} cal`);
console.log(`Completion rate: ${stats.completionRate}%`);
```

---

## 📊 Database Storage

All data is stored in the Supabase KV store with these key patterns:

### Nutrition Entries
- **Key Pattern:** `nutrition:{userId}:{timestamp}`
- **Example:** `nutrition:user123:1739621400000`

### Cooking Sessions
- **Key Pattern:** `session:{userId}:{timestamp}`
- **Example:** `session:user123:1739621400000`

---

## ✅ Success Indicators

**Nutrition Tracking:**
- ✅ Automatic logging when recipes complete
- ✅ Daily calorie/macro tracking
- ✅ Weekly summaries with averages
- ✅ Historical data retention

**Cooking Sessions:**
- ✅ Progress saved automatically
- ✅ Resume interrupted cooking
- ✅ Step-by-step navigation
- ✅ Completion tracking
- ✅ Cooking time analytics

---

## 🚀 Next Steps

1. **Integrate into Recipe Completion UI** - Call nutrition API when user finishes cooking
2. **Create Nutrition Dashboard** - Display daily/weekly summaries
3. **Add Cooking Mode UI** - Step-by-step cooking interface
4. **Progress Persistence** - Auto-save cooking progress every step
5. **Analytics Dashboard** - Show cooking stats and nutrition trends

---

**API Base URL:** `https://{projectId}.supabase.co/functions/v1/make-server-d1bfecde`

**Authorization:** All requests require `Authorization: Bearer {publicAnonKey}` header
