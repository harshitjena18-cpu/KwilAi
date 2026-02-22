import express from 'express';
import {
  getSuggestions,
  searchRecipes,
  getRecipeById,
  getPopularRecipes,
  getHealthyRecipes,
  getRecipesByCuisine,
  getRecipesByDiet,
  getRecipesByHealthGoal,
  getQuickRecipes,
  getBudgetRecipes,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  recipeSearchValidation,
  suggestionValidation,
  validate
} from '../utils/validators.js';

const router = express.Router();

// ===========================
// PUBLIC ROUTES
// ===========================

/**
 * @route   GET /api/recipes/suggestions
 * @desc    Get personalized recipe suggestions
 * @access  Public
 * @query   ingredients, dietType, cuisine, healthGoal, budget, maxCalories, minProtein, limit
 */
router.get('/suggestions', suggestionValidation, validate, getSuggestions);

/**
 * @route   GET /api/recipes/search
 * @desc    Search recipes by text
 * @access  Public
 * @query   q (search query), limit
 */
router.get('/search', recipeSearchValidation, validate, searchRecipes);

/**
 * @route   GET /api/recipes/popular
 * @desc    Get popular recipes
 * @access  Public
 * @query   limit
 */
router.get('/popular', getPopularRecipes);

/**
 * @route   GET /api/recipes/healthy
 * @desc    Get healthy recipes (health score >= 50)
 * @access  Public
 * @query   limit
 */
router.get('/healthy', getHealthyRecipes);

/**
 * @route   GET /api/recipes/quick
 * @desc    Get quick recipes (under 30 minutes)
 * @access  Public
 * @query   limit
 */
router.get('/quick', getQuickRecipes);

/**
 * @route   GET /api/recipes/budget-friendly
 * @desc    Get budget-friendly recipes ($3 or less per serving)
 * @access  Public
 * @query   limit
 */
router.get('/budget-friendly', getBudgetRecipes);

/**
 * @route   GET /api/recipes/cuisine/:cuisine
 * @desc    Get recipes by cuisine type
 * @access  Public
 * @param   cuisine - Cuisine type (italian, mexican, asian, etc.)
 * @query   limit
 */
router.get('/cuisine/:cuisine', getRecipesByCuisine);

/**
 * @route   GET /api/recipes/diet/:diet
 * @desc    Get recipes by diet type
 * @access  Public
 * @param   diet - Diet type (vegetarian, vegan, gluten-free, ketogenic, paleo, pescatarian, whole30)
 * @query   limit
 */
router.get('/diet/:diet', getRecipesByDiet);

/**
 * @route   GET /api/recipes/health-goal/:goal
 * @desc    Get recipes by health goal
 * @access  Public
 * @param   goal - Health goal (weight-loss, muscle-gain, heart-health, diabetes-friendly, high-protein, low-carb, low-fat)
 * @query   limit
 */
router.get('/health-goal/:goal', getRecipesByHealthGoal);

/**
 * @route   GET /api/recipes/:id
 * @desc    Get recipe by ID
 * @access  Public
 * @param   id - Recipe ID
 */
router.get('/:id', getRecipeById);

// ===========================
// PROTECTED ROUTES
// ===========================

/**
 * @route   GET /api/recipes/saved
 * @desc    Get user's saved recipes
 * @access  Private
 * @query   limit
 */
router.get('/saved', protect, getSavedRecipes);

/**
 * @route   POST /api/recipes/:id/save
 * @desc    Save recipe to user's collection
 * @access  Private
 * @param   id - Recipe ID
 */
router.post('/:id/save', protect, saveRecipe);

/**
 * @route   DELETE /api/recipes/:id/save
 * @desc    Remove recipe from user's saved collection
 * @access  Private
 * @param   id - Recipe ID
 */
router.delete('/:id/save', protect, unsaveRecipe);

export default router;
