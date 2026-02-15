import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  updateNotifications,
  changePassword,
  deleteAccount,
  getUserStats,
  saveRecipe,
  unsaveRecipe,
  getSavedRecipes
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  updateProfileValidation,
  updatePreferencesValidation,
  changePasswordValidation,
  validate
} from '../utils/validators.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// ===========================
// PROFILE ROUTES
// ===========================

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile (name, email, image, etc.)
 * @access  Private
 */
router.put('/profile', updateProfileValidation, validate, updateProfile);

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences (diet, cuisine, health goals, budget)
 * @access  Private
 */
router.put('/preferences', updatePreferencesValidation, validate, updatePreferences);

/**
 * @route   PUT /api/users/notifications
 * @desc    Update notification settings
 * @access  Private
 */
router.put('/notifications', updateNotifications);

/**
 * @route   PUT /api/users/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', changePasswordValidation, validate, changePassword);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (soft delete)
 * @access  Private
 */
router.delete('/account', deleteAccount);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', getUserStats);

// ===========================
// RECIPE MANAGEMENT ROUTES
// ===========================

/**
 * @route   GET /api/users/recipes/saved
 * @desc    Get all saved/favorite recipes
 * @access  Private
 */
router.get('/recipes/saved', getSavedRecipes);

/**
 * @route   POST /api/users/recipes/:recipeId/save
 * @desc    Save a recipe to favorites
 * @access  Private
 */
router.post('/recipes/:recipeId/save', saveRecipe);

/**
 * @route   DELETE /api/users/recipes/:recipeId/unsave
 * @desc    Remove a recipe from favorites
 * @access  Private
 */
router.delete('/recipes/:recipeId/unsave', unsaveRecipe);

export default router;
