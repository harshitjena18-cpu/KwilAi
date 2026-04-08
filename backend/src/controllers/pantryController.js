import Pantry from '../models/Pantry.js';
import visionService from '../services/visionService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * @desc    Scan ingredient using image (Google Vision API)
 * @route   POST /api/pantry/scan
 * @access  Private
 */
export const scanIngredient = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image in base64 format'
    });
  }

  // Detect food items using Google Vision API
  const detectedItems = await visionService.detectFood(image);

  if (!detectedItems || detectedItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No food items detected in the image. Please try another photo.',
      detectedItems: []
    });
  }

  res.status(200).json({
    success: true,
    message: `Detected ${detectedItems.length} ingredient(s)`,
    detectedItems: detectedItems.map(item => ({
      name: item.name,
      confidence: item.confidence
    }))
  });
});

/**
 * @desc    Add ingredient to pantry
 * @route   POST /api/pantry
 * @access  Private
 */
export const addIngredient = asyncHandler(async (req, res) => {
  const {
    ingredientName,
    quantity,
    expiryDate,
    category,
    imageUrl,
    detectionConfidence,
    notes
  } = req.body;

  if (!ingredientName) {
    return res.status(400).json({
      success: false,
      message: 'Ingredient name is required'
    });
  }

  // Auto-categorize if not provided
  const finalCategory = category || visionService.categorizeIngredient(ingredientName);

  // Auto-estimate expiry if not provided
  const finalExpiryDate = expiryDate || visionService.estimateExpiryDate(finalCategory);

  const pantryItem = await Pantry.create({
    userId: req.user.id,
    ingredientName: ingredientName.trim().toLowerCase(),
    quantity: quantity || { value: null, unit: null },
    expiryDate: finalExpiryDate,
    category: finalCategory,
    imageUrl,
    detectionConfidence,
    notes
  });

  res.status(201).json({
    success: true,
    message: 'Ingredient added to pantry',
    ingredient: pantryItem
  });
});

/**
 * @desc    Add multiple ingredients to pantry (from scan)
 * @route   POST /api/pantry/batch
 * @access  Private
 */
export const addBatchIngredients = asyncHandler(async (req, res) => {
  const { ingredients, imageUrl } = req.body;

  if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an array of ingredients'
    });
  }

  // ⚡ Bolt: Optimize batch insertion by replacing sequential await Model.create()
  // with a single Model.insertMany() call to reduce database roundtrips.
  const itemsToInsert = ingredients.map(item => {
    const category = item.category || visionService.categorizeIngredient(item.name);
    const expiryDate = item.expiryDate || visionService.estimateExpiryDate(category);

    return {
      userId: req.user.id,
      ingredientName: item.name.trim().toLowerCase(),
      quantity: item.quantity || { value: null, unit: null },
      expiryDate,
      category,
      imageUrl: imageUrl || item.imageUrl,
      detectionConfidence: item.confidence,
      notes: item.notes
    };
  });

  const pantryItems = await Pantry.insertMany(itemsToInsert);

  res.status(201).json({
    success: true,
    message: `${pantryItems.length} ingredient(s) added to pantry`,
    ingredients: pantryItems
  });
});

/**
 * @desc    Get all pantry ingredients
 * @route   GET /api/pantry
 * @access  Private
 */
export const getPantryIngredients = asyncHandler(async (req, res) => {
  const { includeConsumed } = req.query;

  const query = { userId: req.user.id };
  
  if (includeConsumed !== 'true') {
    query.isConsumed = false;
  }

  const ingredients = await Pantry.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: ingredients.length,
    ingredients
  });
});

/**
 * @desc    Get single pantry ingredient
 * @route   GET /api/pantry/:id
 * @access  Private
 */
export const getPantryIngredient = asyncHandler(async (req, res) => {
  const ingredient = await Pantry.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!ingredient) {
    return res.status(404).json({
      success: false,
      message: 'Ingredient not found'
    });
  }

  res.status(200).json({
    success: true,
    ingredient
  });
});

/**
 * @desc    Update pantry ingredient
 * @route   PUT /api/pantry/:id
 * @access  Private
 */
export const updatePantryIngredient = asyncHandler(async (req, res) => {
  let ingredient = await Pantry.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!ingredient) {
    return res.status(404).json({
      success: false,
      message: 'Ingredient not found'
    });
  }

  const allowedUpdates = [
    'ingredientName',
    'quantity',
    'expiryDate',
    'category',
    'notes',
    'isConsumed'
  ];

  const updates = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  ingredient = await Pantry.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Ingredient updated successfully',
    ingredient
  });
});

/**
 * @desc    Delete pantry ingredient
 * @route   DELETE /api/pantry/:id
 * @access  Private
 */
export const deletePantryIngredient = asyncHandler(async (req, res) => {
  const ingredient = await Pantry.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!ingredient) {
    return res.status(404).json({
      success: false,
      message: 'Ingredient not found'
    });
  }

  await ingredient.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Ingredient deleted from pantry'
  });
});

/**
 * @desc    Mark ingredient as consumed
 * @route   PATCH /api/pantry/:id/consume
 * @access  Private
 */
export const markAsConsumed = asyncHandler(async (req, res) => {
  const ingredient = await Pantry.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!ingredient) {
    return res.status(404).json({
      success: false,
      message: 'Ingredient not found'
    });
  }

  await ingredient.markAsConsumed();

  res.status(200).json({
    success: true,
    message: 'Ingredient marked as consumed',
    ingredient
  });
});

/**
 * @desc    Get ingredients expiring soon
 * @route   GET /api/pantry/expiring-soon
 * @access  Private
 */
export const getExpiringSoon = asyncHandler(async (req, res) => {
  const { days = 3 } = req.query;

  const ingredients = await Pantry.getExpiringSoon(req.user.id, parseInt(days));

  res.status(200).json({
    success: true,
    count: ingredients.length,
    ingredients
  });
});

/**
 * @desc    Get expired ingredients
 * @route   GET /api/pantry/expired
 * @access  Private
 */
export const getExpired = asyncHandler(async (req, res) => {
  const ingredients = await Pantry.getExpired(req.user.id);

  res.status(200).json({
    success: true,
    count: ingredients.length,
    ingredients
  });
});

/**
 * @desc    Get ingredients by category
 * @route   GET /api/pantry/category/:category
 * @access  Private
 */
export const getByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;

  const validCategories = [
    'vegetable', 'fruit', 'meat', 'dairy', 'grain',
    'spice', 'condiment', 'beverage', 'snack', 'other'
  ];

  if (!validCategories.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Invalid category. Valid categories: ${validCategories.join(', ')}`
    });
  }

  const ingredients = await Pantry.getByCategory(req.user.id, category);

  res.status(200).json({
    success: true,
    count: ingredients.length,
    category,
    ingredients
  });
});

/**
 * @desc    Search ingredients by name
 * @route   GET /api/pantry/search
 * @access  Private
 */
export const searchIngredients = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const ingredients = await Pantry.searchByName(req.user.id, q);

  res.status(200).json({
    success: true,
    count: ingredients.length,
    searchTerm: q,
    ingredients
  });
});

/**
 * @desc    Get pantry statistics
 * @route   GET /api/pantry/stats
 * @access  Private
 */
export const getPantryStats = asyncHandler(async (req, res) => {
  const stats = await Pantry.getStats(req.user.id);

  res.status(200).json({
    success: true,
    stats
  });
});

/**
 * @desc    Scan and add ingredient (combined operation)
 * @route   POST /api/pantry/scan-and-add
 * @access  Private
 */
export const scanAndAddIngredient = asyncHandler(async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image in base64 format'
    });
  }

  // Step 1: Detect ingredients
  const detectedItems = await visionService.detectFood(image);

  if (!detectedItems || detectedItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No food items detected in the image',
      detectedItems: []
    });
  }

  // Step 2: Add top detected ingredients to pantry
  // Add top 5 detected items (or all if less than 5)
  const itemsToAdd = detectedItems.slice(0, 5);

  // ⚡ Bolt: Optimize batch insertion using Model.insertMany() instead of sequential creates
  // to avoid N+1 database roundtrip issues.
  const itemsToInsert = itemsToAdd.map(item => {
    const category = visionService.categorizeIngredient(item.name);
    const expiryDate = visionService.estimateExpiryDate(category);

    return {
      userId: req.user.id,
      ingredientName: item.name.trim().toLowerCase(),
      quantity: { value: null, unit: null },
      expiryDate,
      category,
      detectionConfidence: item.confidence
    };
  });

  const pantryItems = await Pantry.insertMany(itemsToInsert);

  res.status(201).json({
    success: true,
    message: `Detected and added ${pantryItems.length} ingredient(s) to pantry`,
    detectedItems: detectedItems.map(item => ({
      name: item.name,
      confidence: item.confidence
    })),
    addedIngredients: pantryItems
  });
});

export default {
  scanIngredient,
  addIngredient,
  addBatchIngredients,
  getPantryIngredients,
  getPantryIngredient,
  updatePantryIngredient,
  deletePantryIngredient,
  markAsConsumed,
  getExpiringSoon,
  getExpired,
  getByCategory,
  searchIngredients,
  getPantryStats,
  scanAndAddIngredient
};
