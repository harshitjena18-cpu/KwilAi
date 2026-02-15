import axios from '../utils/axios';

export interface RecipeIngredient {
  name: string;
  amount: number | null;
  unit: string | null;
  original: string | null;
}

export interface RecipeStep {
  number: number;
  instruction: string;
  duration: number | null;
}

export interface RecipeNutrition {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  fiber: number | null;
  sugar: number | null;
}

export interface Recipe {
  _id: string;
  title: string;
  image: string | null;
  sourceUrl: string | null;
  source: 'spoonacular' | 'edamam' | 'gemini' | 'custom';
  externalId: string | null;
  summary: string | null;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  nutrition: RecipeNutrition;
  readyInMinutes: number | null;
  servings: number;
  costEstimate: number | null;
  pricePerServing: number | null;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  healthGoals: string[];
  healthScore: number | null;
  difficulty: 'easy' | 'medium' | 'hard';
  rating: number | null;
  spoonacularScore: number | null;
  savedCount: number;
  optimizationScore?: number;
  caloriesPerServing?: number;
  proteinPerServing?: number;
  isBudgetFriendly?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeSuggestionsParams {
  ingredients?: string[];
  dietType?: string;
  cuisine?: string;
  healthGoal?: string;
  budget?: 'low' | 'medium' | 'high';
  maxCalories?: number;
  minProtein?: number;
  limit?: number;
}

const recipeService = {
  /**
   * Get personalized recipe suggestions
   */
  getSuggestions: async (params: RecipeSuggestionsParams): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const queryParams = new URLSearchParams();

    if (params.ingredients && params.ingredients.length > 0) {
      params.ingredients.forEach(ing => {
        queryParams.append('ingredients', ing);
      });
    }

    if (params.dietType) queryParams.append('dietType', params.dietType);
    if (params.cuisine) queryParams.append('cuisine', params.cuisine);
    if (params.healthGoal) queryParams.append('healthGoal', params.healthGoal);
    if (params.budget) queryParams.append('budget', params.budget);
    if (params.maxCalories) queryParams.append('maxCalories', params.maxCalories.toString());
    if (params.minProtein) queryParams.append('minProtein', params.minProtein.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const response = await axios.get(`/recipes/suggestions?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Search recipes by text
   */
  searchRecipes: async (query: string, limit: number = 10): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/search', {
      params: { q: query, limit }
    });
    return response.data;
  },

  /**
   * Get recipe by ID
   */
  getRecipeById: async (id: string): Promise<{
    success: boolean;
    recipe: Recipe;
  }> => {
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
  },

  /**
   * Get popular recipes
   */
  getPopularRecipes: async (limit: number = 10): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/popular', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get healthy recipes
   */
  getHealthyRecipes: async (limit: number = 10): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/healthy', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get quick recipes (under 30 min)
   */
  getQuickRecipes: async (limit: number = 10): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/quick', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get budget-friendly recipes
   */
  getBudgetRecipes: async (limit: number = 10): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/budget-friendly', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get recipes by cuisine
   */
  getRecipesByCuisine: async (cuisine: string, limit: number = 10): Promise<{
    success: boolean;
    count: number;
    cuisine: string;
    recipes: Recipe[];
  }> => {
    const response = await axios.get(`/recipes/cuisine/${cuisine}`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get recipes by diet
   */
  getRecipesByDiet: async (diet: string, limit: number = 10): Promise<{
    success: boolean;
    count: number;
    diet: string;
    recipes: Recipe[];
  }> => {
    const response = await axios.get(`/recipes/diet/${diet}`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Get recipes by health goal
   */
  getRecipesByHealthGoal: async (goal: string, limit: number = 10): Promise<{
    success: boolean;
    count: number;
    healthGoal: string;
    recipes: Recipe[];
  }> => {
    const response = await axios.get(`/recipes/health-goal/${goal}`, {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Save recipe to user's collection
   */
  saveRecipe: async (recipeId: string): Promise<{
    success: boolean;
    message: string;
    recipe: Recipe;
  }> => {
    const response = await axios.post(`/recipes/${recipeId}/save`);
    return response.data;
  },

  /**
   * Unsave recipe from user's collection
   */
  unsaveRecipe: async (recipeId: string): Promise<{
    success: boolean;
    message: string;
    recipe: Recipe;
  }> => {
    const response = await axios.delete(`/recipes/${recipeId}/save`);
    return response.data;
  },

  /**
   * Get user's saved recipes
   */
  getSavedRecipes: async (limit: number = 20): Promise<{
    success: boolean;
    count: number;
    recipes: Recipe[];
  }> => {
    const response = await axios.get('/recipes/saved', {
      params: { limit }
    });
    return response.data;
  },
};

export default recipeService;
