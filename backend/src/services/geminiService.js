import axios from 'axios';

/**
 * Google Gemini AI Service for Recipe Generation
 * Documentation: https://ai.google.dev/docs
 */

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-pro';
  }

  /**
   * Generate custom recipes using Gemini AI
   * @param {object} params - Recipe generation parameters
   * @returns {Promise<Array>} Array of generated recipes
   */
  async generateRecipes(params) {
    try {
      const {
        ingredients = [],
        dietType = null,
        cuisine = null,
        healthGoal = null,
        budget = null,
        numberOfRecipes = 5
      } = params;

      // Build the AI prompt
      const prompt = this.buildRecipePrompt({
        ingredients,
        dietType,
        cuisine,
        healthGoal,
        budget,
        numberOfRecipes
      });

      // Call Gemini API
      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract and parse the response
      const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        throw new Error('No response from Gemini AI');
      }

      // Parse JSON from response
      const recipes = this.parseGeminiResponse(text);

      return recipes;
    } catch (error) {
      console.error('Gemini AI error:', error.response?.data || error.message);
      throw new Error(`Gemini AI error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Build a structured prompt for recipe generation
   * @param {object} params - Recipe parameters
   * @returns {string} Formatted prompt
   */
  buildRecipePrompt(params) {
    const {
      ingredients,
      dietType,
      cuisine,
      healthGoal,
      budget,
      numberOfRecipes
    } = params;

    let prompt = `You are an expert AI chef and nutritionist. Generate ${numberOfRecipes} optimized recipes based on the following preferences:\n\n`;

    // User preferences
    prompt += `**User Preferences:**\n`;
    if (dietType) prompt += `- Diet Type: ${dietType}\n`;
    if (cuisine) prompt += `- Cuisine: ${cuisine}\n`;
    if (healthGoal) prompt += `- Health Goal: ${healthGoal}\n`;
    if (budget) prompt += `- Budget: ${budget}\n`;
    if (ingredients && ingredients.length > 0) {
      prompt += `- Available Ingredients: ${ingredients.join(', ')}\n`;
    }

    prompt += `\n**Requirements:**\n`;
    prompt += `1. Use available ingredients when possible\n`;
    prompt += `2. Recipes should be easy to follow with clear steps\n`;
    prompt += `3. Include accurate nutritional information\n`;
    prompt += `4. Provide realistic cost estimates\n`;
    prompt += `5. Consider dietary restrictions and health goals\n`;

    prompt += `\n**Output Format:**\n`;
    prompt += `Return ONLY a valid JSON array with ${numberOfRecipes} recipe objects. Each recipe must have this exact structure:\n\n`;

    prompt += `[\n`;
    prompt += `  {\n`;
    prompt += `    "title": "Recipe Name",\n`;
    prompt += `    "summary": "Brief description (max 200 characters)",\n`;
    prompt += `    "cuisine": "cuisine type (lowercase)",\n`;
    prompt += `    "difficulty": "easy|medium|hard",\n`;
    prompt += `    "readyInMinutes": 30,\n`;
    prompt += `    "servings": 4,\n`;
    prompt += `    "ingredients": [\n`;
    prompt += `      {\n`;
    prompt += `        "name": "ingredient name",\n`;
    prompt += `        "amount": 2,\n`;
    prompt += `        "unit": "cups"\n`;
    prompt += `      }\n`;
    prompt += `    ],\n`;
    prompt += `    "steps": [\n`;
    prompt += `      {\n`;
    prompt += `        "number": 1,\n`;
    prompt += `        "instruction": "Step description",\n`;
    prompt += `        "duration": 5\n`;
    prompt += `      }\n`;
    prompt += `    ],\n`;
    prompt += `    "nutrition": {\n`;
    prompt += `      "calories": 350,\n`;
    prompt += `      "protein": 25,\n`;
    prompt += `      "carbs": 40,\n`;
    prompt += `      "fat": 12,\n`;
    prompt += `      "fiber": 6,\n`;
    prompt += `      "sugar": 8\n`;
    prompt += `    },\n`;
    prompt += `    "costEstimate": 15.50,\n`;
    prompt += `    "healthScore": 75\n`;
    prompt += `  }\n`;
    prompt += `]\n\n`;

    prompt += `**Important:**\n`;
    prompt += `- Return ONLY the JSON array, no additional text or markdown\n`;
    prompt += `- Ensure all JSON is properly formatted and valid\n`;
    prompt += `- All numbers should be realistic and accurate\n`;
    prompt += `- Health score should be 0-100 based on nutritional quality\n`;
    prompt += `- Cost estimate should be in USD for total recipe\n`;
    prompt += `- Nutrition values are per serving\n`;

    return prompt;
  }

  /**
   * Parse Gemini AI response to extract recipes
   * @param {string} text - Raw response text
   * @returns {Array} Parsed recipes
   */
  parseGeminiResponse(text) {
    try {
      // Remove markdown code blocks if present
      let jsonText = text.trim();
      jsonText = jsonText.replace(/^```json?\s*/i, '');
      jsonText = jsonText.replace(/```\s*$/, '');
      jsonText = jsonText.trim();

      // Parse JSON
      const recipes = JSON.parse(jsonText);

      // Validate and format each recipe
      return recipes.map(recipe => this.formatGeminiRecipe(recipe));
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      console.error('Raw text:', text);
      throw new Error('Failed to parse AI-generated recipes. Invalid JSON format.');
    }
  }

  /**
   * Format Gemini recipe to match our Recipe model
   * @param {object} geminiRecipe - Raw recipe from Gemini
   * @returns {object} Formatted recipe data
   */
  formatGeminiRecipe(geminiRecipe) {
    try {
      // Validate required fields
      if (!geminiRecipe.title || !geminiRecipe.ingredients || !geminiRecipe.steps) {
        throw new Error('Missing required recipe fields');
      }

      // Determine diets based on ingredients and description
      const diets = this.detectDiets(geminiRecipe);

      // Determine health goals
      const healthGoals = this.detectHealthGoals(geminiRecipe);

      return {
        source: 'gemini',
        externalId: null,
        title: geminiRecipe.title,
        image: null, // Gemini doesn't generate images
        sourceUrl: null,
        summary: geminiRecipe.summary || `AI-generated ${geminiRecipe.cuisine || ''} recipe`,
        ingredients: geminiRecipe.ingredients.map(ing => ({
          name: ing.name,
          amount: ing.amount || null,
          unit: ing.unit || null,
          original: `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim()
        })),
        steps: geminiRecipe.steps.map(step => ({
          number: step.number,
          instruction: step.instruction,
          duration: step.duration || null
        })),
        nutrition: {
          calories: geminiRecipe.nutrition?.calories || null,
          protein: geminiRecipe.nutrition?.protein || null,
          carbs: geminiRecipe.nutrition?.carbs || null,
          fat: geminiRecipe.nutrition?.fat || null,
          fiber: geminiRecipe.nutrition?.fiber || null,
          sugar: geminiRecipe.nutrition?.sugar || null
        },
        readyInMinutes: geminiRecipe.readyInMinutes || null,
        servings: geminiRecipe.servings || 1,
        costEstimate: geminiRecipe.costEstimate || null,
        pricePerServing: geminiRecipe.costEstimate 
          ? Math.round((geminiRecipe.costEstimate / (geminiRecipe.servings || 1)) * 100) 
          : null,
        cuisines: geminiRecipe.cuisine ? [geminiRecipe.cuisine.toLowerCase()] : [],
        dishTypes: [],
        diets,
        healthGoals,
        healthScore: geminiRecipe.healthScore || 50,
        difficulty: geminiRecipe.difficulty || 'medium',
        rating: null,
        isActive: true,
        lastFetched: new Date()
      };
    } catch (error) {
      console.error('Error formatting Gemini recipe:', error);
      throw error;
    }
  }

  /**
   * Detect diet types from recipe content
   * @param {object} recipe - Recipe object
   * @returns {Array} Array of diet types
   */
  detectDiets(recipe) {
    const diets = [];
    const text = `${recipe.title} ${recipe.summary} ${JSON.stringify(recipe.ingredients)}`.toLowerCase();

    // Check for common diet indicators
    if (!text.includes('meat') && !text.includes('chicken') && !text.includes('beef') && 
        !text.includes('pork') && !text.includes('fish')) {
      diets.push('vegetarian');
    }

    if (!text.includes('dairy') && !text.includes('milk') && !text.includes('cheese') && 
        !text.includes('egg') && !text.includes('butter') && diets.includes('vegetarian')) {
      diets.push('vegan');
    }

    if (!text.includes('gluten') && !text.includes('wheat') && !text.includes('bread')) {
      diets.push('gluten-free');
    }

    if (recipe.nutrition?.carbs && recipe.nutrition.carbs < 20) {
      diets.push('ketogenic');
    }

    return diets;
  }

  /**
   * Detect health goals from recipe nutrition
   * @param {object} recipe - Recipe object
   * @returns {Array} Array of health goals
   */
  detectHealthGoals(recipe) {
    const healthGoals = [];
    const nutrition = recipe.nutrition || {};

    if (nutrition.calories && nutrition.calories < 400) {
      healthGoals.push('weight-loss');
    }

    if (nutrition.protein && nutrition.protein > 30) {
      healthGoals.push('high-protein', 'muscle-gain');
    }

    if (nutrition.carbs && nutrition.carbs < 50) {
      healthGoals.push('low-carb');
    }

    if (nutrition.fat && nutrition.fat < 15) {
      healthGoals.push('low-fat');
    }

    if (recipe.healthScore && recipe.healthScore > 70) {
      healthGoals.push('heart-health');
    }

    return healthGoals;
  }

  /**
   * Generate a single personalized recipe
   * @param {object} params - Recipe parameters
   * @returns {Promise<object>} Generated recipe
   */
  async generateSingleRecipe(params) {
    const recipes = await this.generateRecipes({ ...params, numberOfRecipes: 1 });
    return recipes[0];
  }
}

export default new GeminiService();
