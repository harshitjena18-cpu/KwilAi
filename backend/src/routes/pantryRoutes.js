import express from 'express';
import {
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
} from '../controllers/pantryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// ===========================
// SCANNING ROUTES
// ===========================

/**
 * @route   POST /api/pantry/scan
 * @desc    Scan ingredient image with Google Vision API
 * @access  Private
 */
router.post('/scan', scanIngredient);

/**
 * @route   POST /api/pantry/scan-and-add
 * @desc    Scan image and automatically add detected ingredients
 * @access  Private
 */
router.post('/scan-and-add', scanAndAddIngredient);

// ===========================
// CRUD ROUTES
// ===========================

/**
 * @route   POST /api/pantry
 * @desc    Add single ingredient to pantry
 * @access  Private
 */
router.post('/', addIngredient);

/**
 * @route   POST /api/pantry/batch
 * @desc    Add multiple ingredients to pantry
 * @access  Private
 */
router.post('/batch', addBatchIngredients);

/**
 * @route   GET /api/pantry
 * @desc    Get all pantry ingredients
 * @access  Private
 */
router.get('/', getPantryIngredients);

/**
 * @route   GET /api/pantry/stats
 * @desc    Get pantry statistics
 * @access  Private
 */
router.get('/stats', getPantryStats);

/**
 * @route   GET /api/pantry/expiring-soon
 * @desc    Get ingredients expiring soon
 * @access  Private
 */
router.get('/expiring-soon', getExpiringSoon);

/**
 * @route   GET /api/pantry/expired
 * @desc    Get expired ingredients
 * @access  Private
 */
router.get('/expired', getExpired);

/**
 * @route   GET /api/pantry/search
 * @desc    Search ingredients by name
 * @access  Private
 */
router.get('/search', searchIngredients);

/**
 * @route   GET /api/pantry/category/:category
 * @desc    Get ingredients by category
 * @access  Private
 */
router.get('/category/:category', getByCategory);

/**
 * @route   GET /api/pantry/:id
 * @desc    Get single pantry ingredient
 * @access  Private
 */
router.get('/:id', getPantryIngredient);

/**
 * @route   PUT /api/pantry/:id
 * @desc    Update pantry ingredient
 * @access  Private
 */
router.put('/:id', updatePantryIngredient);

/**
 * @route   PATCH /api/pantry/:id/consume
 * @desc    Mark ingredient as consumed
 * @access  Private
 */
router.patch('/:id/consume', markAsConsumed);

/**
 * @route   DELETE /api/pantry/:id
 * @desc    Delete pantry ingredient
 * @access  Private
 */
router.delete('/:id', deletePantryIngredient);

export default router;
