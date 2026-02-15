import axios from 'axios';

/**
 * Google Cloud Vision API Service
 * Detects food items and labels from images
 */

class VisionService {
  constructor() {
    this.apiKey = process.env.GOOGLE_VISION_API_KEY;
    this.endpoint = 'https://vision.googleapis.com/v1/images:annotate';
  }

  /**
   * Detect labels (objects, food items) in an image
   * @param {string} imageBase64 - Base64 encoded image string
   * @returns {Promise<Array>} Array of detected labels with confidence scores
   */
  async detectLabels(imageBase64) {
    try {
      // Remove data URL prefix if present
      const base64Image = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'LABEL_DETECTION',
                maxResults: 10
              },
              {
                type: 'OBJECT_LOCALIZATION',
                maxResults: 10
              }
            ]
          }
        ]
      };

      const response = await axios.post(
        `${this.endpoint}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.responses && response.data.responses[0]) {
        const result = response.data.responses[0];
        return this.parseVisionResponse(result);
      }

      return [];
    } catch (error) {
      console.error('Google Vision API Error:', error.response?.data || error.message);
      throw new Error(`Vision API error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Detect food-specific items in an image
   * @param {string} imageBase64 - Base64 encoded image
   * @returns {Promise<Array>} Array of detected food items
   */
  async detectFood(imageBase64) {
    try {
      const labels = await this.detectLabels(imageBase64);
      
      // Filter for food-related items
      const foodKeywords = [
        'food', 'fruit', 'vegetable', 'meat', 'dairy', 'grain', 
        'produce', 'ingredient', 'cuisine', 'dish', 'beverage',
        'snack', 'breakfast', 'lunch', 'dinner', 'meal'
      ];

      const foodItems = labels.filter(label => {
        const description = label.description.toLowerCase();
        return foodKeywords.some(keyword => description.includes(keyword)) ||
               this.isFoodItem(description);
      });

      return foodItems.length > 0 ? foodItems : labels.slice(0, 5);
    } catch (error) {
      console.error('Food detection error:', error.message);
      throw error;
    }
  }

  /**
   * Parse Vision API response
   * @param {object} result - Vision API response
   * @returns {Array} Parsed labels with confidence
   */
  parseVisionResponse(result) {
    const items = [];

    // Parse label annotations
    if (result.labelAnnotations) {
      result.labelAnnotations.forEach(label => {
        items.push({
          name: label.description,
          confidence: Math.round(label.score * 100),
          type: 'label'
        });
      });
    }

    // Parse object localizations
    if (result.localizedObjectAnnotations) {
      result.localizedObjectAnnotations.forEach(obj => {
        items.push({
          name: obj.name,
          confidence: Math.round(obj.score * 100),
          type: 'object'
        });
      });
    }

    // Sort by confidence (highest first)
    items.sort((a, b) => b.confidence - a.confidence);

    // Remove duplicates
    const uniqueItems = [];
    const seen = new Set();

    for (const item of items) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueItems.push(item);
      }
    }

    return uniqueItems;
  }

  /**
   * Check if a label is likely a food item
   * @param {string} label - Label to check
   * @returns {boolean}
   */
  isFoodItem(label) {
    const foodItems = [
      // Vegetables
      'tomato', 'potato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce',
      'cabbage', 'cauliflower', 'pepper', 'cucumber', 'garlic', 'ginger',
      
      // Fruits
      'apple', 'banana', 'orange', 'grape', 'strawberry', 'mango', 'pineapple',
      'watermelon', 'lemon', 'lime', 'peach', 'pear', 'cherry', 'berry',
      
      // Proteins
      'chicken', 'beef', 'pork', 'fish', 'egg', 'tofu', 'paneer', 'cheese',
      'milk', 'yogurt', 'salmon', 'tuna', 'shrimp', 'lamb',
      
      // Grains
      'rice', 'wheat', 'bread', 'pasta', 'noodle', 'oats', 'quinoa', 'barley',
      
      // Legumes
      'bean', 'lentil', 'chickpea', 'pea', 'dal',
      
      // Spices & Herbs
      'basil', 'oregano', 'thyme', 'cilantro', 'parsley', 'mint', 'turmeric',
      'cumin', 'coriander', 'chili', 'pepper',
      
      // Others
      'oil', 'butter', 'sugar', 'salt', 'flour', 'sauce', 'honey'
    ];

    return foodItems.some(food => label.includes(food));
  }

  /**
   * Categorize detected ingredient
   * @param {string} ingredientName - Name of ingredient
   * @returns {string} Category
   */
  categorizeIngredient(ingredientName) {
    const name = ingredientName.toLowerCase();

    const categories = {
      vegetable: ['tomato', 'potato', 'onion', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cabbage', 'pepper', 'cucumber', 'garlic', 'ginger', 'cauliflower'],
      fruit: ['apple', 'banana', 'orange', 'grape', 'strawberry', 'mango', 'pineapple', 'watermelon', 'lemon', 'lime', 'berry', 'peach', 'pear', 'cherry'],
      meat: ['chicken', 'beef', 'pork', 'lamb', 'turkey', 'duck', 'sausage', 'bacon', 'ham'],
      dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'paneer', 'ghee'],
      grain: ['rice', 'wheat', 'bread', 'pasta', 'noodle', 'oats', 'quinoa', 'barley', 'flour'],
      spice: ['basil', 'oregano', 'thyme', 'cilantro', 'parsley', 'mint', 'turmeric', 'cumin', 'coriander', 'chili', 'pepper', 'salt'],
      condiment: ['sauce', 'ketchup', 'mustard', 'mayo', 'vinegar', 'oil', 'honey', 'syrup'],
      beverage: ['coffee', 'tea', 'juice', 'soda', 'water', 'milk', 'beer', 'wine']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }

    return 'other';
  }

  /**
   * Estimate expiry date based on ingredient category
   * @param {string} category - Ingredient category
   * @returns {Date|null} Estimated expiry date
   */
  estimateExpiryDate(category) {
    const daysToExpiry = {
      vegetable: 5,
      fruit: 7,
      meat: 3,
      dairy: 7,
      grain: 30,
      spice: 365,
      condiment: 90,
      beverage: 30,
      other: 7
    };

    const days = daysToExpiry[category] || 7;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    return expiryDate;
  }
}

export default new VisionService();
