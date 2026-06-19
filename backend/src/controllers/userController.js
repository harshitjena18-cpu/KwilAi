import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password');

  res.status(200).json({
    success: true,
    user: user.fullProfile
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    profileImage: req.body.profileImage,
    measurementUnit: req.body.measurementUnit,
    language: req.body.language
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    fieldsToUpdate,
    {
      new: true, // Return updated document
      runValidators: true // Run model validators
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user: user.fullProfile
  });
});

/**
 * @desc    Update user preferences (diet, cuisine, health goals)
 * @route   PUT /api/users/preferences
 * @access  Private
 */
export const updatePreferences = asyncHandler(async (req, res) => {
  const { dietType, cuisinePreference, healthGoal, budget } = req.body;

  const preferencesToUpdate = {
    dietType,
    cuisinePreference,
    healthGoal,
    budget
  };

  // Remove undefined fields
  Object.keys(preferencesToUpdate).forEach(key => 
    preferencesToUpdate[key] === undefined && delete preferencesToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(
    req.user.id,
    preferencesToUpdate,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    user: user.fullProfile
  });
});

/**
 * @desc    Update notification settings
 * @route   PUT /api/users/notifications
 * @access  Private
 */
export const updateNotifications = asyncHandler(async (req, res) => {
  const { email, push, mealReminders } = req.body;

  const notificationSettings = {};
  if (email !== undefined) notificationSettings['notifications.email'] = email;
  if (push !== undefined) notificationSettings['notifications.push'] = push;
  if (mealReminders !== undefined) notificationSettings['notifications.mealReminders'] = mealReminders;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    notificationSettings,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'Notification settings updated successfully',
    notifications: user.notifications
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/users/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password field
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isPasswordMatch = await user.comparePassword(currentPassword);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Verify password before deletion
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password. Account not deleted.'
    });
  }

  // Soft delete - deactivate account instead of removing
  user.isActive = false;
  await user.save();

  // Alternative: Hard delete
  // await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password');

  const stats = {
    totalSavedRecipes: user.savedRecipes?.length || 0,
    totalCookedMeals: user.cookingHistory?.length || 0,
    memberSince: user.createdAt,
    subscriptionPlan: user.subscriptionPlan,
    isSubscriptionActive: user.isSubscriptionActive(),
    lastLogin: user.lastLogin,
    preferences: {
      dietType: user.dietType,
      cuisinePreference: user.cuisinePreference,
      healthGoal: user.healthGoal,
      budget: user.budget
    }
  };

  res.status(200).json({
    success: true,
    stats
  });
});

/**
 * @desc    Save a recipe to user's favorites
 * @route   POST /api/users/recipes/:recipeId/save
 * @access  Private
 */
export const saveRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const user = await User.findById(req.user.id);

  // Check if recipe already saved
  if (user.savedRecipes.includes(recipeId)) {
    return res.status(400).json({
      success: false,
      message: 'Recipe already saved'
    });
  }

  user.savedRecipes.push(recipeId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Recipe saved successfully',
    savedRecipes: user.savedRecipes
  });
});

/**
 * @desc    Remove a recipe from user's favorites
 * @route   DELETE /api/users/recipes/:recipeId/unsave
 * @access  Private
 */
export const unsaveRecipe = asyncHandler(async (req, res) => {
  const { recipeId } = req.params;

  const user = await User.findById(req.user.id);

  user.savedRecipes = user.savedRecipes.filter(
    id => id.toString() !== recipeId
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Recipe removed from favorites',
    savedRecipes: user.savedRecipes
  });
});

/**
 * @desc    Get all saved recipes
 * @route   GET /api/users/recipes/saved
 * @access  Private
 */
export const getSavedRecipes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('savedRecipes')
    .select('savedRecipes');

  res.status(200).json({
    success: true,
    count: user.savedRecipes.length,
    recipes: user.savedRecipes
  });
});

export default {
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
};
