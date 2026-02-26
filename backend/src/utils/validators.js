import { body, query, validationResult } from 'express-validator';

/**
 * Validation middleware to check for errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: extractedErrors
    });
  }
  
  next();
};

/**
 * Registration validation rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];

/**
 * Login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * Profile update validation rules
 */
export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

/**
 * Preferences update validation rules
 */
export const updatePreferencesValidation = [
  body('dietType')
    .optional()
    .isArray().withMessage('Diet type must be an array')
    .custom((value) => {
      const validDietTypes = [
        'weight-loss', 'muscle-gain', 'vegan', 'vegetarian', 
        'keto', 'paleo', 'jain', 'student-diet', 'balanced', 'none'
      ];
      const allValid = value.every(type => validDietTypes.includes(type));
      if (!allValid) {
        throw new Error('Invalid diet type');
      }
      return true;
    }),
  
  body('cuisinePreference')
    .optional()
    .isArray().withMessage('Cuisine preference must be an array')
    .custom((value) => {
      const validCuisines = [
        'indian', 'chinese', 'italian', 'mexican', 'south-indian',
        'north-indian', 'thai', 'japanese', 'american', 'mediterranean',
        'continental', 'fusion'
      ];
      const allValid = value.every(cuisine => validCuisines.includes(cuisine));
      if (!allValid) {
        throw new Error('Invalid cuisine preference');
      }
      return true;
    }),
  
  body('healthGoal')
    .optional()
    .isArray().withMessage('Health goal must be an array')
    .custom((value) => {
      const validGoals = [
        'high-protein', 'low-carb', 'low-fat', 'high-fiber',
        'low-sodium', 'diabetic-friendly', 'heart-healthy',
        'weight-management', 'muscle-building', 'energy-boost'
      ];
      const allValid = value.every(goal => validGoals.includes(goal));
      if (!allValid) {
        throw new Error('Invalid health goal');
      }
      return true;
    }),
  
  body('budget')
    .optional()
    .isInt({ min: 0, max: 10000 }).withMessage('Budget must be between 0 and 10000'),
];

/**
 * Password change validation rules
 */
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Please confirm your new password')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

/**
 * Recipe search validation rules
 */
export const recipeSearchValidation = [
  query('q')
    .notEmpty().withMessage('Search query is required')
    .isString().withMessage('Search query must be a string')
    .trim(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
    .toInt(),
];

/**
 * Recipe suggestion validation rules
 */
export const suggestionValidation = [
  query('ingredients')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') return true;
      if (Array.isArray(value)) {
        return value.every(i => typeof i === 'string');
      }
      return false;
    })
    .withMessage('Ingredients must be a string or an array of strings'),

  query('dietType').optional().isString().trim(),
  query('cuisine').optional().isString().trim(),
  query('healthGoal').optional().isString().trim(),
  query('budget').optional().isString().trim(),
  query('maxCalories').optional().isInt({ min: 0 }).toInt(),
  query('minProtein').optional().isInt({ min: 0 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
];

/**
 * Voice API validation rules
 */
export const voiceValidation = {
  textToSpeech: [
    body('text')
      .notEmpty().withMessage('Text is required')
      .isString().withMessage('Text must be a string')
      .isLength({ max: 3000 }).withMessage('Text too long (max 3000 chars)')
      .trim(),
    body('languageCode').optional().isString().trim(),
    body('voiceName').optional().isString().trim(),
    body('speakingRate').optional().isFloat({ min: 0.25, max: 4.0 }).withMessage('Speaking rate must be between 0.25 and 4.0')
  ],

  recipeInstructions: [
    body('steps')
      .isArray({ min: 1 }).withMessage('Steps array cannot be empty'),
    body('steps.*.instruction')
      .exists().withMessage('Instruction is required for each step')
      .isString().withMessage('Instruction must be a string')
      .trim(),
    body('steps.*.number')
      .optional()
      .isInt().withMessage('Step number must be an integer')
  ],

  assistance: [
    body('query')
      .notEmpty().withMessage('Query is required')
      .isString().withMessage('Query must be a string')
      .isLength({ max: 500 }).withMessage('Query too long (max 500 chars)')
      .trim()
  ]
};

export default {
  validate,
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updatePreferencesValidation,
  changePasswordValidation,
  recipeSearchValidation,
  suggestionValidation,
  voiceValidation
};
