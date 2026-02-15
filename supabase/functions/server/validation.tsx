/**
 * Input Validation
 * Validates request data for security and data integrity
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { field: 'email', message: 'Invalid email format' };
  }
  return null;
}

/**
 * Validate user ID
 */
export function validateUserId(userId: string): ValidationError | null {
  if (!userId || typeof userId !== 'string') {
    return { field: 'userId', message: 'User ID is required' };
  }
  if (userId.length < 1 || userId.length > 100) {
    return { field: 'userId', message: 'User ID must be between 1 and 100 characters' };
  }
  return null;
}

/**
 * Validate recipe ID
 */
export function validateRecipeId(recipeId: string): ValidationError | null {
  if (!recipeId || typeof recipeId !== 'string') {
    return { field: 'recipeId', message: 'Recipe ID is required' };
  }
  return null;
}

/**
 * Validate session ID
 */
export function validateSessionId(sessionId: string): ValidationError | null {
  if (!sessionId || typeof sessionId !== 'string') {
    return { field: 'sessionId', message: 'Session ID is required' };
  }
  if (!sessionId.startsWith('session:')) {
    return { field: 'sessionId', message: 'Invalid session ID format' };
  }
  return null;
}

/**
 * Validate nutrition data
 */
export function validateNutrition(nutrition: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (nutrition.calories !== undefined) {
    if (typeof nutrition.calories !== 'number' || nutrition.calories < 0 || nutrition.calories > 10000) {
      errors.push({ field: 'calories', message: 'Calories must be a number between 0 and 10000' });
    }
  }

  if (nutrition.protein !== undefined) {
    if (typeof nutrition.protein !== 'number' || nutrition.protein < 0 || nutrition.protein > 1000) {
      errors.push({ field: 'protein', message: 'Protein must be a number between 0 and 1000 grams' });
    }
  }

  if (nutrition.carbs !== undefined) {
    if (typeof nutrition.carbs !== 'number' || nutrition.carbs < 0 || nutrition.carbs > 1000) {
      errors.push({ field: 'carbs', message: 'Carbs must be a number between 0 and 1000 grams' });
    }
  }

  if (nutrition.fats !== undefined) {
    if (typeof nutrition.fats !== 'number' || nutrition.fats < 0 || nutrition.fats > 1000) {
      errors.push({ field: 'fats', message: 'Fats must be a number between 0 and 1000 grams' });
    }
  }

  return errors;
}

/**
 * Validate step index
 */
export function validateStepIndex(stepIndex: number, totalSteps: number): ValidationError | null {
  if (typeof stepIndex !== 'number') {
    return { field: 'stepIndex', message: 'Step index must be a number' };
  }
  if (stepIndex < 0 || stepIndex >= totalSteps) {
    return { field: 'stepIndex', message: `Step index must be between 0 and ${totalSteps - 1}` };
  }
  return null;
}

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(date: string): ValidationError | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return { field: 'date', message: 'Invalid date format. Use YYYY-MM-DD' };
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { field: 'date', message: 'Invalid date value' };
  }
  
  return null;
}

/**
 * Validate image data
 */
export function validateImageData(imageData: string): ValidationError | null {
  if (!imageData || typeof imageData !== 'string') {
    return { field: 'image', message: 'Image data is required' };
  }

  // Check if base64
  const base64Regex = /^data:image\/(png|jpg|jpeg|webp);base64,/;
  if (!base64Regex.test(imageData)) {
    return { field: 'image', message: 'Image must be in base64 format (png, jpg, jpeg, or webp)' };
  }

  // Check size (limit to 10MB)
  const base64Length = imageData.split(',')[1]?.length || 0;
  const sizeInBytes = (base64Length * 3) / 4;
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (sizeInBytes > maxSize) {
    return { field: 'image', message: 'Image size must be less than 10MB' };
  }

  return null;
}

/**
 * Validate recipe name
 */
export function validateRecipeName(name: string): ValidationError | null {
  if (!name || typeof name !== 'string') {
    return { field: 'recipeName', message: 'Recipe name is required' };
  }
  if (name.length < 1 || name.length > 200) {
    return { field: 'recipeName', message: 'Recipe name must be between 1 and 200 characters' };
  }
  return null;
}

/**
 * Validate total steps
 */
export function validateTotalSteps(totalSteps: number): ValidationError | null {
  if (typeof totalSteps !== 'number') {
    return { field: 'totalSteps', message: 'Total steps must be a number' };
  }
  if (totalSteps < 1 || totalSteps > 100) {
    return { field: 'totalSteps', message: 'Total steps must be between 1 and 100' };
  }
  return null;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return '';
  
  // Remove any HTML tags
  const sanitized = input.replace(/<[^>]*>/g, '');
  
  // Trim and limit length
  return sanitized.trim().substring(0, maxLength);
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string): ValidationError | null {
  if (!apiKey || typeof apiKey !== 'string') {
    return { field: 'apiKey', message: 'API key is required' };
  }
  if (apiKey.length < 10) {
    return { field: 'apiKey', message: 'Invalid API key format' };
  }
  return null;
}

/**
 * Validate request body has required fields
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  
  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      errors.push({ field, message: `${field} is required` });
    }
  }
  
  return errors;
}

/**
 * Generic validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Combine multiple validation results
 */
export function combineValidations(...errors: (ValidationError | null)[]): ValidationResult {
  const validationErrors = errors.filter(e => e !== null) as ValidationError[];
  
  return {
    valid: validationErrors.length === 0,
    errors: validationErrors,
  };
}

export default {
  validateEmail,
  validateUserId,
  validateRecipeId,
  validateSessionId,
  validateNutrition,
  validateStepIndex,
  validateDate,
  validateImageData,
  validateRecipeName,
  validateTotalSteps,
  sanitizeString,
  validateApiKey,
  validateRequiredFields,
  combineValidations,
};
