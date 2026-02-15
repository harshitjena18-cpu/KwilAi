import axios from 'axios';

/**
 * Edamam Recipe API Service
 * Documentation: https://developer.edamam.com/edamam-docs-recipe-api
 */

class EdamamService {
  constructor() {
    this.appId = process.env.EDAMAM_APP_ID;
    this.appKey = process.env.EDAMAM_APP_KEY;
    this.baseUrl = 'https://api.edamam.com/api/recipes/v2';
  }

  /**
   * Search recipes
   * @param {object} params - Search parameters
   * @returns {Promise<object>} Search results
   */
  async searchRecipes(params = {}) {
    try {
      const searchParams = {
        type: 'public',
        app_id: this.appId,
        app_key: this.appKey,
        q: params.query || '',
        from: params.from || 0,
        to: params.to || 10
      };

      // Add optional filters
      if (params.diet) searchParams.diet = params.diet.toLowerCase();
      if (params.health) searchParams.health = params.health;
      if (params.cuisineType) searchParams.cuisineType = params.cuisineType.toLowerCase();
      if (params.mealType) searchParams.mealType = params.mealType;
      if (params.dishType) searchParams.dishType = params.dishType;
      if (params.calories) searchParams.calories = params.calories; // e.g., "100-500"
      if (params.nutrients) {
        // e.g., { PROCNT: "10+", CHOCDF: "50-100" }
        Object.keys(params.nutrients).forEach(key => {
          searchParams[key] = params.nutrients[key];
        });
      }

      const response = await axios.get(this.baseUrl, { params: searchParams });

      return response.data;
    } catch (error) {
      console.error('Edamam searchRecipes error:', error.response?.data || error.message);
      throw new Error(`Edamam API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Search recipes by ingredients
   * @param {string[]} ingredients - Array of ingredient names
   * @param {object} options - Search options
   * @returns {Promise<Array>} Array of recipes
   */
  async searchByIngredients(ingredients, options = {}) {
    try {
      // Edamam uses query string for ingredients
      const query = ingredients.join(' ');

      const params = {
        query,
        diet: options.diet,
        health: options.health,
        cuisineType: options.cuisine,
        calories: options.calories,
        to: options.number || 10
      };

      const result = await this.searchRecipes(params);
      return result.hits || [];
    } catch (error) {
      console.error('Edamam searchByIngredients error:', error.message);
      throw error;
    }
  }

  /**
   * Parse Edamam recipe to our Recipe model format
   * @param {object} edamamHit - Raw recipe hit from Edamam
   * @returns {object} Formatted recipe data
   */
  parseRecipe(edamamHit) {
    try {
      const recipe = edamamHit.recipe;

      // Generate a unique ID from URI
      const externalId = recipe.uri.split('#')[1] || recipe.uri;

      // Parse ingredients
      const ingredients = recipe.ingredients.map(ing => ({
        name: ing.food,
        amount: ing.quantity || null,
        unit: ing.measure || null,
        original: ing.text
      }));

      // Edamam doesn't provide steps, so we'll leave it empty
      const steps = [];

      // Extract nutrition (Edamam provides total nutrition)
      const totalNutrients = recipe.totalNutrients || {};
      const servings = recipe.yield || 1;

      const nutrition = {
        calories: totalNutrients.ENERC_KCAL?.quantity 
          ? Math.round(totalNutrients.ENERC_KCAL.quantity / servings) 
          : null,
        protein: totalNutrients.PROCNT?.quantity 
          ? Math.round(totalNutrients.PROCNT.quantity / servings) 
          : null,
        carbs: totalNutrients.CHOCDF?.quantity 
          ? Math.round(totalNutrients.CHOCDF.quantity / servings) 
          : null,
        fat: totalNutrients.FAT?.quantity 
          ? Math.round(totalNutrients.FAT.quantity / servings) 
          : null,
        fiber: totalNutrients.FIBTG?.quantity 
          ? Math.round(totalNutrients.FIBTG.quantity / servings) 
          : null,
        sugar: totalNutrients.SUGAR?.quantity 
          ? Math.round(totalNutrients.SUGAR.quantity / servings) 
          : null
      };

      // Map Edamam diet labels to our format
      const dietMap = {
        'balanced': null,
        'high-protein': null,
        'low-fat': null,
        'low-carb': null
      };

      const diets = [];
      if (recipe.dietLabels) {
        recipe.dietLabels.forEach(label => {
          const lower = label.toLowerCase();
          if (lower.includes('vegan')) diets.push('vegan');
          else if (lower.includes('vegetarian')) diets.push('vegetarian');
          else if (lower.includes('paleo')) diets.push('paleo');
          else if (lower.includes('keto')) diets.push('ketogenic');
        });
      }

      // Map health labels to our health goals
      const healthGoals = [];
      if (recipe.healthLabels) {
        const labels = recipe.healthLabels.map(l => l.toLowerCase());
        if (labels.some(l => l.includes('low-fat'))) healthGoals.push('low-fat');
        if (labels.some(l => l.includes('sugar-conscious'))) healthGoals.push('diabetes-friendly');
        if (nutrition.protein && nutrition.protein > 30) healthGoals.push('high-protein', 'muscle-gain');
        if (nutrition.calories && nutrition.calories < 400) healthGoals.push('weight-loss');
        if (labels.some(l => l.includes('low-sodium'))) healthGoals.push('heart-health');
      }

      // Calculate health score (0-100) based on various factors
      let healthScore = 50; // Base score
      
      // Increase score for positive attributes
      if (recipe.healthLabels?.length > 5) healthScore += 20;
      if (nutrition.fiber && nutrition.fiber > 5) healthScore += 10;
      if (nutrition.protein && nutrition.protein > 20) healthScore += 10;
      if (nutrition.calories && nutrition.calories < 500) healthScore += 10;
      
      // Decrease score for negative attributes
      if (nutrition.fat && nutrition.fat > 30) healthScore -= 10;
      if (nutrition.sugar && nutrition.sugar > 20) healthScore -= 10;
      
      healthScore = Math.max(0, Math.min(100, healthScore));

      // Determine difficulty based on ingredients count
      let difficulty = 'medium';
      if (recipe.ingredients.length < 6) difficulty = 'easy';
      else if (recipe.ingredients.length > 12) difficulty = 'hard';

      return {
        source: 'edamam',
        externalId,
        title: recipe.label,
        image: recipe.image,
        sourceUrl: recipe.url,
        summary: recipe.source ? `Recipe from ${recipe.source}` : null,
        ingredients,
        steps,
        nutrition,
        readyInMinutes: recipe.totalTime || null,
        servings: recipe.yield || 1,
        pricePerServing: null, // Edamam doesn't provide pricing
        cuisines: recipe.cuisineType?.map(c => c.toLowerCase()) || [],
        dishTypes: recipe.dishType?.map(d => d.toLowerCase()) || [],
        diets,
        healthGoals,
        healthScore,
        difficulty,
        rating: null, // Edamam doesn't provide ratings
        isActive: true,
        lastFetched: new Date()
      };
    } catch (error) {
      console.error('Error parsing Edamam recipe:', error);
      throw error;
    }
  }

  /**
   * Get recipe by URI
   * @param {string} uri - Recipe URI
   * @returns {Promise<object>} Recipe details
   */
  async getRecipeByUri(uri) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          type: 'public',
          app_id: this.appId,
          app_key: this.appKey,
          uri
        }
      });

      return response.data.hits?.[0] || null;
    } catch (error) {
      console.error('Edamam getRecipeByUri error:', error.response?.data || error.message);
      throw new Error(`Edamam API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default new EdamamService();
