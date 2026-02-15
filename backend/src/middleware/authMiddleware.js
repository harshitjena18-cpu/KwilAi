import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - JWT authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Check for token in cookies (alternative method)
  else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (exclude password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found with this token'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Attach user to request object
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

/**
 * Grant access to specific roles/subscription plans
 * @param  {...string} plans - Allowed subscription plans
 */
export const authorize = (...plans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!plans.includes(req.user.subscriptionPlan)) {
      return res.status(403).json({
        success: false,
        message: `This feature requires ${plans.join(' or ')} subscription. Your current plan: ${req.user.subscriptionPlan}`
      });
    }

    next();
  };
};

/**
 * Check if user has premium access
 * Used for premium features that require active subscription
 */
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.hasPremiumAccess()) {
    return res.status(403).json({
      success: false,
      message: 'This feature requires an active premium or enterprise subscription',
      upgrade: {
        currentPlan: req.user.subscriptionPlan,
        requiredPlan: 'premium',
        upgradeUrl: '/api/subscription/upgrade'
      }
    });
  }

  next();
};

/**
 * Optional authentication
 * Attaches user to request if token is valid, but doesn't block request
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Token invalid, but we don't block the request
    console.log('Optional auth: Invalid token, continuing without user');
  }

  next();
};

export default { protect, authorize, requirePremium, optionalAuth };
