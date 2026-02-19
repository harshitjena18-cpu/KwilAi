import recipeService from '../services/recipeService.js';
import Recipe from '../models/Recipe.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get recipe suggestions
 * @route   GET /api/recipes/suggestions
 * @access  Public
 */
export const getSuggestions = asyncHandler(async (req, res) => {
  const {
    ingredients,
    dietType,
    cuisine,
    healthGoal,
    budget,
    maxCalories,
    minProtein,
    limit
  } = req.query;

  // Parse ingredients from query string or array
  let ingredientList = [];
  if (ingredients) {
    ingredientList = Array.isArray(ingredients) 
      ? ingredients 
      : ingredients.split(',').map(i => i.trim());
  }

  const params = {
    ingredients: ingredientList,
    dietType,
    cuisine,
    healthGoal,
    budget,
    maxCalories: maxCalories ? parseInt(maxCalories) : null,
    minProtein: minProtein ? parseInt(minProtein) : null,
    limit: limit ? parseInt(limit) : 10
  };

  console.log('Recipe suggestions request:', params);

  const recipes = await recipeService.getSuggestions(params);

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Search recipes
 * @route   GET /api/recipes/search
 * @access  Public
 */
export const searchRecipes = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const recipes = await Recipe.find({
    $text: { $search: q },
    isActive: true
  })
  .sort({ score: { $meta: 'textScore' } })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Get recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
export const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return res.status(404).json({
      success: false,
      message: 'Recipe not found'
    });
  }

  res.status(200).json({
    success: true,
    recipe
  });
});

/**
 * @desc    Get popular recipes
 * @route   GET /api/recipes/popular
 * @access  Public
 */
export const getPopularRecipes = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recipes = await Recipe.getPopular(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Get healthy recipes
 * @route   GET /api/recipes/healthy
 * @access  Public
 */
export const getHealthyRecipes = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recipes = await Recipe.getHealthy(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Get recipes by cuisine
 * @route   GET /api/recipes/cuisine/:cuisine
 * @access  Public
 */
export const getRecipesByCuisine = asyncHandler(async (req, res) => {
  const { cuisine } = req.params;
  const { limit = 10 } = req.query;

  const recipes = await Recipe.find({
    cuisines: cuisine.toLowerCase(),
    isActive: true
  })
  .sort({ healthScore: -1, savedCount: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    cuisine,
    recipes
  });
});

/**
 * @desc    Get recipes by diet
 * @route   GET /api/recipes/diet/:diet
 * @access  Public
 */
export const getRecipesByDiet = asyncHandler(async (req, res) => {
  const { diet } = req.params;
  const { limit = 10 } = req.query;

  const validDiets = ['vegetarian', 'vegan', 'gluten-free', 'ketogenic', 'paleo', 'pescatarian', 'whole30'];
  
  if (!validDiets.includes(diet.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid diet type. Valid types: ${validDiets.join(', ')}`
    });
  }

  const recipes = await Recipe.find({
    diets: diet.toLowerCase(),
    isActive: true
  })
  .sort({ healthScore: -1, savedCount: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    diet,
    recipes
  });
});

/**
 * @desc    Get recipes by health goal
 * @route   GET /api/recipes/health-goal/:goal
 * @access  Public
 */
export const getRecipesByHealthGoal = asyncHandler(async (req, res) => {
  const { goal } = req.params;
  const { limit = 10 } = req.query;

  const validGoals = ['weight-loss', 'muscle-gain', 'heart-health', 'diabetes-friendly', 'high-protein', 'low-carb', 'low-fat'];
  
  if (!validGoals.includes(goal.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid health goal. Valid goals: ${validGoals.join(', ')}`
    });
  }

  const recipes = await Recipe.find({
    healthGoals: goal.toLowerCase(),
    isActive: true
  })
  .sort({ healthScore: -1, savedCount: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    healthGoal: goal,
    recipes
  });
});

/**
 * @desc    Get quick recipes (under 30 minutes)
 * @route   GET /api/recipes/quick
 * @access  Public
 */
export const getQuickRecipes = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recipes = await Recipe.find({
    readyInMinutes: { $lte: 30, $ne: null },
    isActive: true
  })
  .sort({ readyInMinutes: 1, healthScore: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Get budget-friendly recipes
 * @route   GET /api/recipes/budget-friendly
 * @access  Public
 */
export const getBudgetRecipes = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const recipes = await Recipe.find({
    pricePerServing: { $lte: 300, $ne: null }, // $3 or less per serving
    isActive: true
  })
  .sort({ pricePerServing: 1, healthScore: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

/**
 * @desc    Save recipe to user's saved recipes
 * @route   POST /api/recipes/:id/save
 * @access  Private
 */
export const saveRecipe = asyncHandler(async (req, res) => {
  // Optimization: Use findOneAndUpdate for atomic update
  // This reduces DB calls from 2 (read + write) to 1 in the happy path
  // and prevents race conditions where multiple requests could increment count incorrectly
  const recipe = await Recipe.findOneAndUpdate(
    { _id: req.params.id, savedBy: { $ne: req.user._id } },
    {
      $addToSet: { savedBy: req.user._id },
      $inc: { savedCount: 1 }
    },
    { new: true }
  );

  if (recipe) {
    return res.status(200).json({
      success: true,
      message: 'Recipe saved successfully',
      recipe
    });
  }

  // Fallback to check specific error case (only if update didn't happen)
  const existingRecipe = await Recipe.findById(req.params.id);

  if (!existingRecipe) {
    return res.status(404).json({
      success: false,
      message: 'Recipe not found'
    });
  }

  // If recipe exists but wasn't updated, it means user already saved it
  // (because savedBy: { $ne: req.user._id } condition failed)
  return res.status(400).json({
    success: false,
    message: 'Recipe already saved'
  });
});

/**
 * @desc    Unsave recipe from user's saved recipes
 * @route   DELETE /api/recipes/:id/save
 * @access  Private
 */
export const unsaveRecipe = asyncHandler(async (req, res) => {
  // Attempt to remove user from savedBy and decrement savedCount atomically
  // only if user is in savedBy list
  const recipe = await Recipe.findOneAndUpdate(
    { _id: req.params.id, savedBy: req.user.id },
    {
      $pull: { savedBy: req.user.id },
      $inc: { savedCount: -1 }
    },
    { new: true }
  );

  if (!recipe) {
    // If update returned null, either recipe doesn't exist or user hasn't saved it
    const existingRecipe = await Recipe.findById(req.params.id);

    if (!existingRecipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Recipe exists but user not in saved list
    return res.status(400).json({
      success: false,
      message: 'Recipe not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Recipe removed from saved list',
    recipe
  });
});

/**
 * @desc    Get user's saved recipes
 * @route   GET /api/recipes/saved
 * @access  Private
 */
export const getSavedRecipes = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const recipes = await Recipe.find({
    savedBy: req.user.id,
    isActive: true
  })
  .sort({ updatedAt: -1 })
  .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: recipes.length,
    recipes
  });
});

export default {
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
};
