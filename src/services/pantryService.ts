import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';

export interface DetectedIngredient {
  name: string;
  confidence: number;
}

export interface PantryIngredient {
  _id: string;
  userId: string;
  ingredientName: string;
  quantity: {
    value: number | null;
    unit: string | null;
  };
  detectedAt: string;
  expiryDate: string | null;
  category: string;
  imageUrl: string | null;
  detectionConfidence: number | null;
  isConsumed: boolean;
  consumedAt: string | null;
  notes: string | null;
  isExpired?: boolean;
  daysUntilExpiry?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PantryStats {
  totalActive: number;
  totalConsumed: number;
  expiringSoonCount: number;
  expiredCount: number;
  totalScans: number;
}

const pantryService = {
  /**
   * Scan image for ingredients using Google Vision API
   */
  scanImage: async (base64Image: string): Promise<{ success: boolean; detectedItems: DetectedIngredient[] }> => {
    const response = await axios.post('/pantry/scan', {
      image: base64Image
    });
    return response.data;
  },

  /**
   * Scan and add ingredients to pantry in one step
   */
  scanAndAdd: async (base64Image: string): Promise<{ 
    success: boolean; 
    detectedItems: DetectedIngredient[];
    addedIngredients: PantryIngredient[];
  }> => {
    const response = await axios.post('/pantry/scan-and-add', {
      image: base64Image
    });
    return response.data;
  },

  /**
   * Add single ingredient to pantry
   */
  addIngredient: async (data: {
    ingredientName: string;
    quantity?: { value: number; unit: string };
    expiryDate?: string;
    category?: string;
    imageUrl?: string;
    detectionConfidence?: number;
    notes?: string;
  }): Promise<{ success: boolean; ingredient: PantryIngredient }> => {
    const response = await axios.post('/pantry', data);
    return response.data;
  },

  /**
   * Add multiple ingredients to pantry (batch)
   */
  addBatchIngredients: async (ingredients: Array<{
    name: string;
    confidence?: number;
    quantity?: { value: number; unit: string };
    expiryDate?: string;
    category?: string;
    notes?: string;
  }>, imageUrl?: string): Promise<{ 
    success: boolean; 
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.post('/pantry/batch', {
      ingredients,
      imageUrl
    });
    return response.data;
  },

  /**
   * Get all pantry ingredients
   */
  getIngredients: async (includeConsumed: boolean = false): Promise<{
    success: boolean;
    count: number;
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.get('/pantry', {
      params: { includeConsumed }
    });
    return response.data;
  },

  /**
   * Get single ingredient
   */
  getIngredient: async (id: string): Promise<{
    success: boolean;
    ingredient: PantryIngredient;
  }> => {
    const response = await axios.get(`/pantry/${id}`);
    return response.data;
  },

  /**
   * Update ingredient
   */
  updateIngredient: async (id: string, data: Partial<{
    ingredientName: string;
    quantity: { value: number; unit: string };
    expiryDate: string;
    category: string;
    notes: string;
    isConsumed: boolean;
  }>): Promise<{
    success: boolean;
    ingredient: PantryIngredient;
  }> => {
    const response = await axios.put(`/pantry/${id}`, data);
    return response.data;
  },

  /**
   * Delete ingredient
   */
  deleteIngredient: async (id: string): Promise<{ success: boolean }> => {
    const response = await axios.delete(`/pantry/${id}`);
    return response.data;
  },

  /**
   * Mark ingredient as consumed
   */
  markAsConsumed: async (id: string): Promise<{
    success: boolean;
    ingredient: PantryIngredient;
  }> => {
    const response = await axios.patch(`/pantry/${id}/consume`);
    return response.data;
  },

  /**
   * Get ingredients expiring soon
   */
  getExpiringSoon: async (days: number = 3): Promise<{
    success: boolean;
    count: number;
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.get('/pantry/expiring-soon', {
      params: { days }
    });
    return response.data;
  },

  /**
   * Get expired ingredients
   */
  getExpired: async (): Promise<{
    success: boolean;
    count: number;
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.get('/pantry/expired');
    return response.data;
  },

  /**
   * Get ingredients by category
   */
  getByCategory: async (category: string): Promise<{
    success: boolean;
    count: number;
    category: string;
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.get(`/pantry/category/${category}`);
    return response.data;
  },

  /**
   * Search ingredients
   */
  searchIngredients: async (query: string): Promise<{
    success: boolean;
    count: number;
    searchTerm: string;
    ingredients: PantryIngredient[];
  }> => {
    const response = await axios.get('/pantry/search', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Get pantry statistics
   */
  getStats: async (): Promise<{
    success: boolean;
    stats: PantryStats;
  }> => {
    const response = await axios.get('/pantry/stats');
    return response.data;
  },
};

export default pantryService;
