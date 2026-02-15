import axios from 'axios';

/**
 * Spoonacular API Service
 * Documentation: https://spoonacular.com/food-api/docs
 */

class SpoonacularService {
  constructor() {
    this.apiKey = process.env.SPOONACULAR_API_KEY;
    this.baseUrl = 'https://api.spoonacular.com';
  }

  /**
   * Search recipes by ingredients
   * @param {string[]} ingredients - Array of ingredient names
   * @param {object} options - Search options
   * @returns {Promise<Array>} Array of recipes
   */
  async searchByIngredients(ingredients, options = {}) {
    try {
      const {
        number = 10,
        ranking = 1, // 1 = maximize used ingredients, 2 = minimize missing ingredients
        ignorePantry = true,
        diet = null,
        intolerances = null,
        cuisine = null,
        maxReadyTime = null
      } = options;

      const params = {
        apiKey: this.apiKey,
        ingredients: ingredients.join(','),
        number,
        ranking,
        ignorePantry,
        addRecipeInformation: true,
        fillIngredients: true
      };

      if (diet) params.diet = diet;
      if (intolerances) params.intolerances = intolerances;
      if (cuisine) params.cuisine = cuisine;
      if (maxReadyTime) params.maxReadyTime = maxReadyTime;

      const response = await axios.get(
        `${this.baseUrl}/recipes/findByIngredients`,
        { params }
      );

      return response.data;
    } catch (error) {
      console.error('Spoonacular searchByIngredients error:', error.response?.data || error.message);
      throw new Error(`Spoonacular API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get recipe information by ID
   * @param {number} recipeId - Spoonacular recipe ID
   * @returns {Promise<object>} Recipe details
   */
  async getRecipeInformation(recipeId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/recipes/${recipeId}/information`,
        {
          params: {
            apiKey: this.apiKey,
            includeNutrition: true
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Spoonacular getRecipeInformation error:', error.response?.data || error.message);
      throw new Error(`Spoonacular API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Complex recipe search
   * @param {object} params - Search parameters
   * @returns {Promise<object>} Search results
   */
  async complexSearch(params = {}) {
    try {
      const searchParams = {
        apiKey: this.apiKey,
        addRecipeInformation: true,
        addRecipeNutrition: true,
        fillIngredients: true,
        number: params.number || 10,
        offset: params.offset || 0
      };

      // Add optional filters
      if (params.query) searchParams.query = params.query;
      if (params.cuisine) searchParams.cuisine = params.cuisine;
      if (params.diet) searchParams.diet = params.diet;
      if (params.intolerances) searchParams.intolerances = params.intolerances;
      if (params.includeIngredients) searchParams.includeIngredients = params.includeIngredients;
      if (params.excludeIngredients) searchParams.excludeIngredients = params.excludeIngredients;
      if (params.maxReadyTime) searchParams.maxReadyTime = params.maxReadyTime;
      if (params.minCalories) searchParams.minCalories = params.minCalories;
      if (params.maxCalories) searchParams.maxCalories = params.maxCalories;
      if (params.minProtein) searchParams.minProtein = params.minProtein;
      if (params.maxCarbs) searchParams.maxCarbs = params.maxCarbs;
      if (params.maxFat) searchParams.maxFat = params.maxFat;
      if (params.sort) searchParams.sort = params.sort; // popularity, healthiness, price, time, random

      const response = await axios.get(
        `${this.baseUrl}/recipes/complexSearch`,
        { params: searchParams }
      );

      return response.data;
    } catch (error) {
      console.error('Spoonacular complexSearch error:', error.response?.data || error.message);
      throw new Error(`Spoonacular API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get bulk recipe information
   * @param {number[]} recipeIds - Array of recipe IDs
   * @returns {Promise<Array>} Array of recipe details
   */
  async getBulkRecipeInformation(recipeIds) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/recipes/informationBulk`,
        {
          params: {
            apiKey: this.apiKey,
            ids: recipeIds.join(','),
            includeNutrition: true
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Spoonacular getBulkRecipeInformation error:', error.response?.data || error.message);
      throw new Error(`Spoonacular API error: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Parse Spoonacular recipe to our Recipe model format
   * @param {object} spoonacularRecipe - Raw recipe from Spoonacular
   * @returns {object} Formatted recipe data
   */
  parseRecipe(spoonacularRecipe) {
    try {
      // Extract nutrition data
      const nutrition = spoonacularRecipe.nutrition?.nutrients || [];
      const getNutrient = (name) => {
        const nutrient = nutrition.find(n => n.name === name);
        return nutrient ? nutrient.amount : null;
      };

      // Parse ingredients
      const ingredients = (spoonacularRecipe.extendedIngredients || []).map(ing => ({
        name: ing.name,
        amount: ing.amount || null,
        unit: ing.unit || null,
        original: ing.original
      }));

      // Parse instructions
      let steps = [];
      if (spoonacularRecipe.analyzedInstructions && spoonacularRecipe.analyzedInstructions.length > 0) {
        steps = spoonacularRecipe.analyzedInstructions[0].steps.map(step => ({
          number: step.number,
          instruction: step.step,
          duration: step.length?.number || null
        }));
      } else if (spoonacularRecipe.instructions) {
        // Fallback: parse text instructions
        const instructionLines = spoonacularRecipe.instructions
          .split(/\n+/)
          .filter(line => line.trim())
          .map((line, index) => ({
            number: index + 1,
            instruction: line.replace(/^\d+\.\s*/, '').trim(),
            duration: null
          }));
        steps = instructionLines;
      }

      // Extract diets
      const diets = [];
      if (spoonacularRecipe.vegetarian) diets.push('vegetarian');
      if (spoonacularRecipe.vegan) diets.push('vegan');
      if (spoonacularRecipe.glutenFree) diets.push('gluten-free');
      if (spoonacularRecipe.ketogenic) diets.push('ketogenic');
      if (spoonacularRecipe.dairyFree) diets.push('dairy-free');

      // Determine health goals based on nutrition
      const healthGoals = [];
      const calories = getNutrient('Calories');
      const protein = getNutrient('Protein');
      const carbs = getNutrient('Carbohydrates');
      const fat = getNutrient('Fat');

      if (calories && calories < 400) healthGoals.push('weight-loss');
      if (protein && protein > 30) healthGoals.push('high-protein', 'muscle-gain');
      if (carbs && carbs < 50) healthGoals.push('low-carb');
      if (fat && fat < 15) healthGoals.push('low-fat');
      if (spoonacularRecipe.veryHealthy) healthGoals.push('heart-health');

      // Determine difficulty
      let difficulty = 'medium';
      const readyTime = spoonacularRecipe.readyInMinutes || 0;
      if (readyTime < 20) difficulty = 'easy';
      else if (readyTime > 60) difficulty = 'hard';

      return {
        source: 'spoonacular',
        externalId: spoonacularRecipe.id?.toString(),
        title: spoonacularRecipe.title,
        image: spoonacularRecipe.image,
        sourceUrl: spoonacularRecipe.sourceUrl,
        summary: spoonacularRecipe.summary?.replace(/<[^>]*>/g, ''), // Remove HTML tags
        ingredients,
        steps,
        nutrition: {
          calories: getNutrient('Calories'),
          protein: getNutrient('Protein'),
          carbs: getNutrient('Carbohydrates'),
          fat: getNutrient('Fat'),
          fiber: getNutrient('Fiber'),
          sugar: getNutrient('Sugar')
        },
        readyInMinutes: spoonacularRecipe.readyInMinutes,
        servings: spoonacularRecipe.servings || 1,
        pricePerServing: spoonacularRecipe.pricePerServing,
        cuisines: spoonacularRecipe.cuisines?.map(c => c.toLowerCase()) || [],
        dishTypes: spoonacularRecipe.dishTypes?.map(d => d.toLowerCase()) || [],
        diets,
        healthGoals,
        healthScore: spoonacularRecipe.healthScore,
        spoonacularScore: spoonacularRecipe.spoonacularScore,
        difficulty,
        rating: spoonacularRecipe.aggregateLikes ? Math.min(spoonacularRecipe.aggregateLikes / 20, 5) : null,
        isActive: true,
        lastFetched: new Date()
      };
    } catch (error) {
      console.error('Error parsing Spoonacular recipe:', error);
      throw error;
    }
  }

  /**
   * Get similar recipes
   * @param {number} recipeId - Recipe ID
   * @param {number} number - Number of similar recipes
   * @returns {Promise<Array>} Similar recipes
   */
  async getSimilarRecipes(recipeId, number = 5) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/recipes/${recipeId}/similar`,
        {
          params: {
            apiKey: this.apiKey,
            number
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Spoonacular getSimilarRecipes error:', error.response?.data || error.message);
      throw new Error(`Spoonacular API error: ${error.response?.data?.message || error.message}`);
    }
  }
}

export default new SpoonacularService();
