import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  verifyEmail,
  checkAuth
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  registerValidation,
  loginValidation,
  validate
} from '../utils/validators.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

// ===========================
// PUBLIC ROUTES
// ===========================

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
// Apply rate limiter to registration to prevent mass account creation
router.post('/register', registerLimiter, registerValidation, validate, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginLimiter, loginValidation, validate, login);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify user email address
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

// ===========================
// PROTECTED ROUTES
// ===========================

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', protect, logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh authentication token
 * @access  Private
 */
router.post('/refresh', protect, refreshToken);

/**
 * @route   GET /api/auth/check
 * @desc    Check if user is authenticated
 * @access  Private
 */
router.get('/check', protect, checkAuth);

export default router;
