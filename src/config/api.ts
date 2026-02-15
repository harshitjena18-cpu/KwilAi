export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  API_PATH: '/api',
  TIMEOUT: 30000, // 30 seconds (longer for image processing)
};

export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_ME: '/auth/me',
  CHECK_AUTH: '/auth/check',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  UPDATE_PREFERENCES: '/users/preferences',
  UPDATE_NOTIFICATIONS: '/users/notifications',
  CHANGE_PASSWORD: '/users/password',
  GET_STATS: '/users/stats',
  
  // Recipes
  SAVED_RECIPES: '/users/recipes/saved',
  SAVE_RECIPE: (id: string) => `/users/recipes/${id}/save`,
  UNSAVE_RECIPE: (id: string) => `/users/recipes/${id}/unsave`,
  
  // Pantry
  SCAN_IMAGE: '/pantry/scan',
  SCAN_AND_ADD: '/pantry/scan-and-add',
  ADD_INGREDIENT: '/pantry',
  BATCH_INGREDIENTS: '/pantry/batch',
  GET_INGREDIENTS: '/pantry',
  GET_INGREDIENT: (id: string) => `/pantry/${id}`,
  UPDATE_INGREDIENT: (id: string) => `/pantry/${id}`,
  DELETE_INGREDIENT: (id: string) => `/pantry/${id}`,
  MARK_CONSUMED: (id: string) => `/pantry/${id}/consume`,
  EXPIRING_SOON: '/pantry/expiring-soon',
  EXPIRED: '/pantry/expired',
  SEARCH_INGREDIENTS: '/pantry/search',
  CATEGORY: (category: string) => `/pantry/category/${category}`,
  PANTRY_STATS: '/pantry/stats',
};

export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PATH}${endpoint}`;
};
