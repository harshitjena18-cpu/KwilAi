import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as nutrition from "./nutrition.tsx";
import * as cookingSession from "./cookingSession.tsx";
import * as planManager from "./planManager.tsx";
import * as stripe from "./stripe.tsx";
import * as validation from "./validation.tsx";
import * as rateLimit from "./rateLimit.tsx";
import { requestLoggingMiddleware, errorLoggingMiddleware, createLogger } from "./logger.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
    maxAge: 600,
  }),
);

// Custom request logging
app.use('*', requestLoggingMiddleware());

// Error logging middleware
app.use('*', errorLoggingMiddleware());

// General rate limiting
app.use('/make-server-d1bfecde/*', rateLimit.rateLimitMiddleware('general'));

// Health check endpoint
app.get("/make-server-d1bfecde/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// PLAN MANAGEMENT ENDPOINTS
// ============================================

/**
 * Get user plan and usage summary
 * GET /make-server-d1bfecde/plan/:userId
 */
app.get("/make-server-d1bfecde/plan/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userIdError = validation.validateUserId(userId);
    if (userIdError) {
      return c.json({ error: userIdError.message }, 400);
    }

    const summary = await planManager.getUsageSummary(userId);
    return c.json({ success: true, ...summary });
  } catch (error: any) {
    console.error("Error getting plan:", error);
    return c.json({ error: error.message || "Failed to get plan info" }, 500);
  }
});

/**
 * Check if user can perform scan
 * GET /make-server-d1bfecde/plan/:userId/can-scan
 */
app.get("/make-server-d1bfecde/plan/:userId/can-scan", async (c) => {
  try {
    const userId = c.req.param("userId");
    const result = await planManager.canPerformScan(userId);
    return c.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Error checking scan permission:", error);
    return c.json({ error: error.message || "Failed to check scan permission" }, 500);
  }
});

/**
 * Check if user can perform AI generation
 * GET /make-server-d1bfecde/plan/:userId/can-generate
 */
app.get("/make-server-d1bfecde/plan/:userId/can-generate", async (c) => {
  try {
    const userId = c.req.param("userId");
    const result = await planManager.canPerformAIGeneration(userId);
    return c.json({ success: true, ...result });
  } catch (error: any) {
    console.error("Error checking AI generation permission:", error);
    return c.json({ error: error.message || "Failed to check generation permission" }, 500);
  }
});

/**
 * Record a scan usage
 * POST /make-server-d1bfecde/plan/:userId/use-scan
 */
app.post("/make-server-d1bfecde/plan/:userId/use-scan", async (c) => {
  try {
    const userId = c.req.param("userId");

    // Check if allowed first
    const check = await planManager.canPerformScan(userId);
    if (!check.allowed) {
      return c.json({
        error: "Daily scan limit reached",
        remaining: 0,
        limit: check.limit,
        plan: (await planManager.getUserPlan(userId)).plan,
      }, 429);
    }

    const usage = await planManager.incrementScans(userId);
    const updatedCheck = await planManager.canPerformScan(userId);

    return c.json({
      success: true,
      scansUsed: usage.scans,
      remaining: updatedCheck.remaining,
      limit: updatedCheck.limit,
    });
  } catch (error: any) {
    console.error("Error recording scan:", error);
    return c.json({ error: error.message || "Failed to record scan" }, 500);
  }
});

/**
 * Record an AI generation usage
 * POST /make-server-d1bfecde/plan/:userId/use-generation
 */
app.post("/make-server-d1bfecde/plan/:userId/use-generation", async (c) => {
  try {
    const userId = c.req.param("userId");

    const check = await planManager.canPerformAIGeneration(userId);
    if (!check.allowed) {
      return c.json({
        error: "Daily AI generation limit reached",
        remaining: 0,
        limit: check.limit,
        plan: (await planManager.getUserPlan(userId)).plan,
      }, 429);
    }

    const usage = await planManager.incrementAIGenerations(userId);
    const updatedCheck = await planManager.canPerformAIGeneration(userId);

    return c.json({
      success: true,
      generationsUsed: usage.aiGenerations,
      remaining: updatedCheck.remaining,
      limit: updatedCheck.limit,
    });
  } catch (error: any) {
    console.error("Error recording AI generation:", error);
    return c.json({ error: error.message || "Failed to record AI generation" }, 500);
  }
});

/**
 * Get usage history
 * GET /make-server-d1bfecde/plan/:userId/history
 */
app.get("/make-server-d1bfecde/plan/:userId/history", async (c) => {
  try {
    const userId = c.req.param("userId");
    const startDate = c.req.query("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = c.req.query("endDate") || new Date().toISOString().split('T')[0];

    const history = await planManager.getHistoricalUsage(userId, startDate, endDate);
    return c.json({ success: true, history });
  } catch (error: any) {
    console.error("Error getting usage history:", error);
    return c.json({ error: error.message || "Failed to get usage history" }, 500);
  }
});

// ============================================
// STRIPE PAYMENT ENDPOINTS
// ============================================

/**
 * Create checkout session for Pro upgrade
 * POST /make-server-d1bfecde/stripe/checkout
 */
app.post("/make-server-d1bfecde/stripe/checkout", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, email, name } = body;

    if (!userId || !email) {
      return c.json({ error: "Missing required fields: userId, email" }, 400);
    }

    const emailError = validation.validateEmail(email);
    if (emailError) {
      return c.json({ error: emailError.message }, 400);
    }

    const session = await stripe.createCheckoutSession(userId, email, name);
    return c.json({ success: true, ...session });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return c.json({ error: error.message || "Failed to create checkout session" }, 500);
  }
});

/**
 * Create customer portal session
 * POST /make-server-d1bfecde/stripe/portal
 */
app.post("/make-server-d1bfecde/stripe/portal", async (c) => {
  try {
    const body = await c.req.json();
    const { userId } = body;

    if (!userId) {
      return c.json({ error: "Missing required field: userId" }, 400);
    }

    const session = await stripe.createPortalSession(userId);
    return c.json({ success: true, ...session });
  } catch (error: any) {
    console.error("Error creating portal session:", error);
    return c.json({ error: error.message || "Failed to create portal session" }, 500);
  }
});

/**
 * Get subscription info
 * GET /make-server-d1bfecde/stripe/subscription/:userId
 */
app.get("/make-server-d1bfecde/stripe/subscription/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const info = await stripe.getSubscriptionInfo(userId);
    return c.json({ success: true, subscription: info });
  } catch (error: any) {
    console.error("Error getting subscription info:", error);
    return c.json({ error: error.message || "Failed to get subscription info" }, 500);
  }
});

/**
 * Stripe webhook handler
 * POST /make-server-d1bfecde/stripe/webhook
 */
app.post("/make-server-d1bfecde/stripe/webhook", async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header("stripe-signature");

    if (!signature) {
      return c.json({ error: "Missing stripe-signature header" }, 400);
    }

    const event = stripe.verifyWebhookSignature(body, signature);
    await stripe.processWebhookEvent(event);

    return c.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return c.json({ error: error.message || "Webhook processing failed" }, 400);
  }
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

    // Validate nutrition data
    const nutritionErrors = validation.validateNutrition({ calories, protein, carbs, fats });
    if (nutritionErrors.length > 0) {
      return c.json({ error: "Validation failed", errors: nutritionErrors }, 400);
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

    const dateError = validation.validateDate(date);
    if (dateError) {
      return c.json({ error: dateError.message }, 400);
    }

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

    const fieldErrors = validation.validateRequiredFields(body, ['userId', 'recipeId', 'recipeName', 'totalSteps']);
    if (fieldErrors.length > 0) {
      return c.json({ error: "Missing required fields", errors: fieldErrors }, 400);
    }

    const stepsError = validation.validateTotalSteps(totalSteps);
    if (stepsError) {
      return c.json({ error: stepsError.message }, 400);
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

// ============================================
// RATE LIMIT STATUS ENDPOINT
// ============================================

/**
 * Get rate limit status
 * GET /make-server-d1bfecde/rate-limit/:type
 */
app.get("/make-server-d1bfecde/rate-limit/:type", async (c) => {
  try {
    const type = c.req.param("type") as keyof typeof rateLimit.RATE_LIMITS;
    const userId = c.req.header('X-User-Id') || 'anonymous';
    
    const status = await rateLimit.getRateLimitStatus(userId, type);
    return c.json({ success: true, ...status });
  } catch (error: any) {
    console.error("Error getting rate limit status:", error);
    return c.json({ error: error.message || "Failed to get rate limit status" }, 500);
  }
});

Deno.serve(app.fetch);
