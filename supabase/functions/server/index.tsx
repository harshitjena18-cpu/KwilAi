import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as nutrition from "./nutrition.tsx";
import * as cookingSession from "./cookingSession.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-d1bfecde/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================
// NUTRITION TRACKING ENDPOINTS
// ============================================

/**
 * Add nutrition entry when recipe is completed
 * POST /make-server-d1bfecde/nutrition
 */
app.post("/make-server-d1bfecde/nutrition", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, calories, protein, carbs, fats, recipeId, recipeName } = body;

    if (!userId || calories === undefined || protein === undefined || carbs === undefined || fats === undefined) {
      return c.json({ error: "Missing required fields: userId, calories, protein, carbs, fats" }, 400);
    }

    const entry = await nutrition.addNutritionEntry(
      userId,
      calories,
      protein,
      carbs,
      fats,
      recipeId,
      recipeName
    );

    return c.json({ success: true, entry });
  } catch (error: any) {
    console.error("Error adding nutrition entry:", error);
    return c.json({ error: error.message || "Failed to add nutrition entry" }, 500);
  }
});

/**
 * Get daily nutrition summary
 * GET /make-server-d1bfecde/nutrition/daily/:userId/:date
 */
app.get("/make-server-d1bfecde/nutrition/daily/:userId/:date", async (c) => {
  try {
    const userId = c.req.param("userId");
    const date = c.req.param("date");

    const summary = await nutrition.getDailySummary(userId, date);
    return c.json({ success: true, summary });
  } catch (error: any) {
    console.error("Error getting daily summary:", error);
    return c.json({ error: error.message || "Failed to get daily summary" }, 500);
  }
});

/**
 * Get weekly nutrition summary
 * GET /make-server-d1bfecde/nutrition/weekly/:userId
 * Optional query param: weekStart (YYYY-MM-DD)
 */
app.get("/make-server-d1bfecde/nutrition/weekly/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const weekStart = c.req.query("weekStart");

    const summary = await nutrition.getWeeklySummary(userId, weekStart);
    return c.json({ success: true, summary });
  } catch (error: any) {
    console.error("Error getting weekly summary:", error);
    return c.json({ error: error.message || "Failed to get weekly summary" }, 500);
  }
});

/**
 * Delete nutrition entry
 * DELETE /make-server-d1bfecde/nutrition/:userId/:entryId
 */
app.delete("/make-server-d1bfecde/nutrition/:userId/:entryId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const entryId = c.req.param("entryId");

    await nutrition.deleteNutritionEntry(userId, entryId);
    return c.json({ success: true, message: "Entry deleted" });
  } catch (error: any) {
    console.error("Error deleting nutrition entry:", error);
    return c.json({ error: error.message || "Failed to delete entry" }, 500);
  }
});

// ============================================
// COOKING SESSION ENDPOINTS
// ============================================

/**
 * Start a new cooking session
 * POST /make-server-d1bfecde/cooking/start
 */
app.post("/make-server-d1bfecde/cooking/start", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, recipeId, recipeName, totalSteps } = body;

    if (!userId || !recipeId || !recipeName || !totalSteps) {
      return c.json({ error: "Missing required fields: userId, recipeId, recipeName, totalSteps" }, 400);
    }

    const session = await cookingSession.startCookingSession(userId, recipeId, recipeName, totalSteps);
    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error starting cooking session:", error);
    return c.json({ error: error.message || "Failed to start cooking session" }, 500);
  }
});

/**
 * Get active session for a recipe
 * GET /make-server-d1bfecde/cooking/active/:userId/:recipeId
 */
app.get("/make-server-d1bfecde/cooking/active/:userId/:recipeId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const recipeId = c.req.param("recipeId");

    const session = await cookingSession.getActiveSession(userId, recipeId);
    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error getting active session:", error);
    return c.json({ error: error.message || "Failed to get active session" }, 500);
  }
});

/**
 * Get session by ID
 * GET /make-server-d1bfecde/cooking/session/:sessionId
 */
app.get("/make-server-d1bfecde/cooking/session/:sessionId", async (c) => {
  try {
    const sessionId = c.req.param("sessionId");
    const session = await cookingSession.getSession(sessionId);
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error getting session:", error);
    return c.json({ error: error.message || "Failed to get session" }, 500);
  }
});

/**
 * Get all user sessions
 * GET /make-server-d1bfecde/cooking/sessions/:userId
 * Optional query param: includeCompleted (true/false)
 */
app.get("/make-server-d1bfecde/cooking/sessions/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const includeCompleted = c.req.query("includeCompleted") !== "false";

    const sessions = await cookingSession.getUserSessions(userId, includeCompleted);
    return c.json({ success: true, sessions });
  } catch (error: any) {
    console.error("Error getting user sessions:", error);
    return c.json({ error: error.message || "Failed to get user sessions" }, 500);
  }
});

/**
 * Move to next step
 * POST /make-server-d1bfecde/cooking/next
 */
app.post("/make-server-d1bfecde/cooking/next", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, sessionId } = body;

    if (!userId || !sessionId) {
      return c.json({ error: "Missing required fields: userId, sessionId" }, 400);
    }

    const session = await cookingSession.nextStep(userId, sessionId);
    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error moving to next step:", error);
    return c.json({ error: error.message || "Failed to move to next step" }, 500);
  }
});

/**
 * Move to previous step
 * POST /make-server-d1bfecde/cooking/previous
 */
app.post("/make-server-d1bfecde/cooking/previous", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, sessionId } = body;

    if (!userId || !sessionId) {
      return c.json({ error: "Missing required fields: userId, sessionId" }, 400);
    }

    const session = await cookingSession.previousStep(userId, sessionId);
    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error moving to previous step:", error);
    return c.json({ error: error.message || "Failed to move to previous step" }, 500);
  }
});

/**
 * Go to specific step
 * POST /make-server-d1bfecde/cooking/goto
 */
app.post("/make-server-d1bfecde/cooking/goto", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, sessionId, stepIndex } = body;

    if (!userId || !sessionId || stepIndex === undefined) {
      return c.json({ error: "Missing required fields: userId, sessionId, stepIndex" }, 400);
    }

    const session = await cookingSession.goToStep(userId, sessionId, stepIndex);
    return c.json({ success: true, session });
  } catch (error: any) {
    console.error("Error going to step:", error);
    return c.json({ error: error.message || "Failed to go to step" }, 500);
  }
});

/**
 * Finish cooking session
 * POST /make-server-d1bfecde/cooking/finish
 */
app.post("/make-server-d1bfecde/cooking/finish", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, sessionId, nutrition: nutritionData } = body;

    if (!userId || !sessionId) {
      return c.json({ error: "Missing required fields: userId, sessionId" }, 400);
    }

    // Finish the cooking session
    const session = await cookingSession.finishCookingSession(userId, sessionId);

    // If nutrition data provided, add nutrition entry
    let nutritionEntry = null;
    if (nutritionData && nutritionData.calories !== undefined) {
      nutritionEntry = await nutrition.addNutritionEntry(
        userId,
        nutritionData.calories,
        nutritionData.protein || 0,
        nutritionData.carbs || 0,
        nutritionData.fats || 0,
        session.recipeId,
        session.recipeName
      );
    }

    return c.json({ 
      success: true, 
      session,
      nutritionEntry 
    });
  } catch (error: any) {
    console.error("Error finishing cooking session:", error);
    return c.json({ error: error.message || "Failed to finish cooking session" }, 500);
  }
});

/**
 * Delete/cancel cooking session
 * DELETE /make-server-d1bfecde/cooking/session/:userId/:sessionId
 */
app.delete("/make-server-d1bfecde/cooking/session/:userId/:sessionId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const sessionId = c.req.param("sessionId");

    await cookingSession.deleteCookingSession(userId, sessionId);
    return c.json({ success: true, message: "Session deleted" });
  } catch (error: any) {
    console.error("Error deleting cooking session:", error);
    return c.json({ error: error.message || "Failed to delete session" }, 500);
  }
});

/**
 * Get cooking statistics
 * GET /make-server-d1bfecde/cooking/stats/:userId
 */
app.get("/make-server-d1bfecde/cooking/stats/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const stats = await cookingSession.getCookingStats(userId);
    return c.json({ success: true, stats });
  } catch (error: any) {
    console.error("Error getting cooking stats:", error);
    return c.json({ error: error.message || "Failed to get cooking stats" }, 500);
  }
});

Deno.serve(app.fetch);