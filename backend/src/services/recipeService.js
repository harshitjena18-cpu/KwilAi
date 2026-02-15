import spoonacularService from './spoonacularService.js';
import edamamService from './edamamService.js';
import geminiService from './geminiService.js';
import Recipe from '../models/Recipe.js';

/**
 * Recipe Aggregation Service
 * Orchestrates multiple recipe APIs and AI generation
 */

class RecipeService {
  /**
   * Get recipe suggestions based on user preferences
   * @param {object} params - Search parameters
   * @returns {Promise<Array>} Array of optimized recipes
   */
  async getSuggestions(params) {
    try {
      const {
        ingredients = [],
        dietType = null,
        cuisine = null,
        healthGoal = null,
        budget = null,
        maxCalories = null,
        minProtein = null,
        limit = 10
      } = params;

      console.log('Getting recipe suggestions with params:', params);

      let allRecipes = [];

      // Step 1: Try to get recipes from Spoonacular
      try {
        console.log('Fetching from Spoonacular...');
        const spoonacularRecipes = await this.getSpoonacularRecipes({
          ingredients,
          dietType,
          cuisine,
          maxCalories,
          minProtein,
          limit: 15 // Fetch more to have options for filtering
        });

        console.log(`Fetched ${spoonacularRecipes.length} recipes from Spoonacular`);
        allRecipes = allRecipes.concat(spoonacularRecipes);
      } catch (error) {
        console.error('Spoonacular API failed:', error.message);
      }

      // Step 2: If we don't have enough results, try Edamam
      if (allRecipes.length < limit) {
        try {
          console.log('Fetching from Edamam...');
          const edamamRecipes = await this.getEdamamRecipes({
            ingredients,
            dietType,
            cuisine,
            maxCalories,
            limit: 15 - allRecipes.length
          });

          console.log(`Fetched ${edamamRecipes.length} recipes from Edamam`);
          allRecipes = allRecipes.concat(edamamRecipes);
        } catch (error) {
          console.error('Edamam API failed:', error.message);
        }
      }

      // Step 3: Filter and score recipes
      let filteredRecipes = this.filterRecipes(allRecipes, {
        dietType,
        healthGoal,
        budget,
        maxCalories,
        minProtein
      });

      console.log(`After filtering: ${filteredRecipes.length} recipes`);

      // Step 4: If still insufficient, generate with Gemini AI
      if (filteredRecipes.length < 5 && process.env.GEMINI_API_KEY) {
        try {
          console.log('Generating recipes with Gemini AI...');
          const geminiRecipes = await this.getGeminiRecipes({
            ingredients,
            dietType,
            cuisine,
            healthGoal,
            budget,
            numberOfRecipes: Math.min(10 - filteredRecipes.length, 5)
          });

          console.log(`Generated ${geminiRecipes.length} recipes with Gemini AI`);
          filteredRecipes = filteredRecipes.concat(geminiRecipes);
        } catch (error) {
          console.error('Gemini AI failed:', error.message);
        }
      }

      // Step 5: Sort and optimize results
      const optimizedRecipes = this.optimizeRecipes(filteredRecipes, {
        healthGoal,
        budget,
        ingredients
      });

      // Step 6: Return top results
      const topRecipes = optimizedRecipes.slice(0, limit);

      console.log(`Returning ${topRecipes.length} optimized recipes`);

      // Step 7: Save to database for caching
      await this.saveRecipesToDB(topRecipes);

      return topRecipes;
    } catch (error) {
      console.error('Recipe service error:', error);
      throw error;
    }
  }

  /**
   * Fetch recipes from Spoonacular API
   * @param {object} params - Search parameters
   * @returns {Promise<Array>} Parsed recipes
   */
  async getSpoonacularRecipes(params) {
    try {
      if (!process.env.SPOONACULAR_API_KEY) {
        console.log('Spoonacular API key not configured');
        return [];
      }

      const { ingredients, dietType, cuisine, maxCalories, minProtein, limit } = params;

      // Use complex search for better filtering
      const searchParams = {
        number: limit || 10,
        sort: 'healthiness'
      };

      if (ingredients && ingredients.length > 0) {
        searchParams.includeIngredients = ingredients.join(',');
      }

      if (dietType) searchParams.diet = dietType;
      if (cuisine) searchParams.cuisine = cuisine;
      if (maxCalories) searchParams.maxCalories = maxCalories;
      if (minProtein) searchParams.minProtein = minProtein;

      const result = await spoonacularService.complexSearch(searchParams);

      if (!result.results || result.results.length === 0) {
        return [];
      }

      // Parse and format recipes
      const recipes = result.results.map(recipe => 
        spoonacularService.parseRecipe(recipe)
      );

      return recipes;
    } catch (error) {
      console.error('Error fetching Spoonacular recipes:', error.message);
      return [];
    }
  }

  /**
   * Fetch recipes from Edamam API
   * @param {object} params - Search parameters
   * @returns {Promise<Array>} Parsed recipes
   */
  async getEdamamRecipes(params) {
    try {
      if (!process.env.EDAMAM_APP_ID || !process.env.EDAMAM_APP_KEY) {
        console.log('Edamam API credentials not configured');
        return [];
      }

      const { ingredients, dietType, cuisine, maxCalories, limit } = params;

      const searchParams = {
        to: limit || 10
      };

      if (ingredients && ingredients.length > 0) {
        searchParams.query = ingredients.join(' ');
      }

      if (dietType) searchParams.diet = dietType;
      if (cuisine) searchParams.cuisineType = cuisine;
      if (maxCalories) searchParams.calories = `0-${maxCalories}`;

      const result = await edamamService.searchRecipes(searchParams);

      if (!result.hits || result.hits.length === 0) {
        return [];
      }

      // Parse and format recipes
      const recipes = result.hits.map(hit => 
        edamamService.parseRecipe(hit)
      );

      return recipes;
    } catch (error) {
      console.error('Error fetching Edamam recipes:', error.message);
      return [];
    }
  }

  /**
   * Generate recipes using Gemini AI
   * @param {object} params - Generation parameters
   * @returns {Promise<Array>} Generated recipes
   */
  async getGeminiRecipes(params) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.log('Gemini API key not configured');
        return [];
      }

      const recipes = await geminiService.generateRecipes(params);
      return recipes;
    } catch (error) {
      console.error('Error generating Gemini recipes:', error.message);
      return [];
    }
  }

  /**
   * Filter recipes based on user preferences
   * @param {Array} recipes - Array of recipes
   * @param {object} filters - Filter criteria
   * @returns {Array} Filtered recipes
   */
  filterRecipes(recipes, filters) {
    const { dietType, healthGoal, budget, maxCalories, minProtein } = filters;

    return recipes.filter(recipe => {
      // Diet filter
      if (dietType && recipe.diets && !recipe.diets.includes(dietType.toLowerCase())) {
        return false;
      }

      // Health goal filter
      if (healthGoal && recipe.healthGoals && !recipe.healthGoals.includes(healthGoal.toLowerCase())) {
        // Be flexible - if no specific health goals, check nutrition
        if (healthGoal === 'weight-loss' && recipe.nutrition?.calories) {
          const cals = recipe.nutrition.calories / (recipe.servings || 1);
          if (cals > 500) return false;
        } else if (healthGoal === 'high-protein' && recipe.nutrition?.protein) {
          const protein = recipe.nutrition.protein / (recipe.servings || 1);
          if (protein < 20) return false;
        }
      }

      // Budget filter (if price available)
      if (budget && recipe.pricePerServing) {
        const budgetMap = {
          'low': 300,      // $3
          'medium': 600,   // $6
          'high': 1000     // $10
        };
        const maxPrice = budgetMap[budget.toLowerCase()] || 600;
        if (recipe.pricePerServing > maxPrice) {
          return false;
        }
      }

      // Calorie filter
      if (maxCalories && recipe.nutrition?.calories) {
        const cals = recipe.nutrition.calories / (recipe.servings || 1);
        if (cals > maxCalories) return false;
      }

      // Protein filter
      if (minProtein && recipe.nutrition?.protein) {
        const protein = recipe.nutrition.protein / (recipe.servings || 1);
        if (protein < minProtein) return false;
      }

      return true;
    });
  }

  /**
   * Optimize recipe ordering based on user preferences
   * @param {Array} recipes - Array of recipes
   * @param {object} preferences - User preferences
   * @returns {Array} Sorted recipes
   */
  optimizeRecipes(recipes, preferences) {
    const { healthGoal, budget, ingredients = [] } = preferences;

    return recipes.map(recipe => {
      let score = recipe.healthScore || 50;

      // Boost score for matching ingredients
      if (ingredients.length > 0 && recipe.ingredients) {
        const matchedIngredients = recipe.ingredients.filter(ing =>
          ingredients.some(userIng => 
            ing.name.toLowerCase().includes(userIng.toLowerCase()) ||
            userIng.toLowerCase().includes(ing.name.toLowerCase())
          )
        ).length;

        score += (matchedIngredients / ingredients.length) * 20;
      }

      // Boost for health goals
      if (healthGoal && recipe.healthGoals?.includes(healthGoal.toLowerCase())) {
        score += 15;
      }

      // Boost for budget
      if (budget === 'low' && recipe.isBudgetFriendly) {
        score += 10;
      }

      // Boost for high ratings
      if (recipe.rating) {
        score += recipe.rating * 2;
      }

      // Boost for Spoonacular score
      if (recipe.spoonacularScore) {
        score += recipe.spoonacularScore * 0.1;
      }

      return {
        ...recipe,
        optimizationScore: score
      };
    }).sort((a, b) => b.optimizationScore - a.optimizationScore);
  }

  /**
   * Save recipes to database for caching
   * @param {Array} recipes - Array of recipes
   * @returns {Promise<void>}
   */
  async saveRecipesToDB(recipes) {
    try {
      const savePromises = recipes.map(async (recipeData) => {
        try {
          await Recipe.findOrCreate(recipeData);
        } catch (error) {
          console.error('Error saving recipe:', error.message);
        }
      });

      await Promise.all(savePromises);
      console.log(`Saved ${recipes.length} recipes to database`);
    } catch (error) {
      console.error('Error saving recipes to DB:', error);
    }
  }

  /**
   * Get recipe by ID from database
   * @param {string} recipeId - Recipe ID
   * @returns {Promise<object>} Recipe
   */
  async getRecipeById(recipeId) {
    return await Recipe.findById(recipeId);
  }

  /**
   * Search recipes in database
   * @param {object} query - Search query
   * @returns {Promise<Array>} Recipes
   */
  async searchRecipes(query) {
    const { ingredients, filters, limit = 10 } = query;

    return await Recipe.searchByIngredients(ingredients, {
      ...filters,
      limit
    });
  }
}

export default new RecipeService();
