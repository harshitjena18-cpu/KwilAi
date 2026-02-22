import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  image: {
    type: String,
    default: null
  },
  sourceUrl: {
    type: String,
    default: null
  },
  source: {
    type: String,
    enum: ['spoonacular', 'edamam', 'gemini', 'custom'],
    required: true
  },
  externalId: {
    type: String,
    default: null,
    index: true
  },

  // Ingredients
  ingredients: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      default: null
    },
    unit: {
      type: String,
      default: null
    },
    original: {
      type: String,
      default: null
    }
  }],

  // Instructions
  steps: [{
    number: {
      type: Number,
      required: true
    },
    instruction: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: null
    }
  }],

  // Nutrition
  nutrition: {
    calories: {
      type: Number,
      default: null
    },
    protein: {
      type: Number,
      default: null
    },
    carbs: {
      type: Number,
      default: null
    },
    fat: {
      type: Number,
      default: null
    },
    fiber: {
      type: Number,
      default: null
    },
    sugar: {
      type: Number,
      default: null
    }
  },

  // Time & Servings
  readyInMinutes: {
    type: Number,
    default: null
  },
  servings: {
    type: Number,
    default: 1
  },

  // Cost
  costEstimate: {
    type: Number,
    default: null
  },
  pricePerServing: {
    type: Number,
    default: null
  },

  // Categories
  cuisines: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  dishTypes: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  diets: [{
    type: String,
    lowercase: true,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'ketogenic', 'paleo', 'pescatarian', 'whole30']
  }],

  // Health
  healthGoals: [{
    type: String,
    lowercase: true,
    enum: ['weight-loss', 'muscle-gain', 'heart-health', 'diabetes-friendly', 'high-protein', 'low-carb', 'low-fat']
  }],
  healthScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },

  // Additional Info
  summary: {
    type: String,
    maxlength: [1000, 'Summary cannot exceed 1000 characters'],
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Rating & Popularity
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: null
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  spoonacularScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },

  // User Engagement
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedCount: {
    type: Number,
    default: 0
  },

  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  lastFetched: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ===========================
// INDEXES
// ===========================

recipeSchema.index({ title: 'text', summary: 'text' });
recipeSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });
// Optimized indexes including isActive and sort fields
recipeSchema.index({ cuisines: 1, isActive: 1, healthScore: -1, savedCount: -1 });
recipeSchema.index({ diets: 1, isActive: 1, healthScore: -1, savedCount: -1 });
recipeSchema.index({ healthGoals: 1, isActive: 1, healthScore: -1, savedCount: -1 });
recipeSchema.index({ 'nutrition.calories': 1 });
recipeSchema.index({ 'nutrition.protein': 1 });
recipeSchema.index({ savedBy: 1, updatedAt: -1 }); // Optimized for "Saved Recipes" query
// Compound indexes for common sort patterns + health score tie-breaking
recipeSchema.index({ isActive: 1, savedCount: -1, healthScore: -1 }); // Optimized for "Popular" sort
recipeSchema.index({ isActive: 1, healthScore: -1, savedCount: -1 }); // Optimized for "Healthy" sort & ingredient search
recipeSchema.index({ isActive: 1, readyInMinutes: 1, healthScore: -1 }); // Optimized for "Quick" recipes
recipeSchema.index({ isActive: 1, pricePerServing: 1, healthScore: -1 }); // Optimized for "Budget" recipes
recipeSchema.index({ createdAt: -1 });

// ===========================
// VIRTUALS
// ===========================

// Calculate calories per serving
recipeSchema.virtual('caloriesPerServing').get(function() {
  if (this.nutrition?.calories && this.servings) {
    return Math.round(this.nutrition.calories / this.servings);
  }
  return null;
});

// Calculate protein per serving
recipeSchema.virtual('proteinPerServing').get(function() {
  if (this.nutrition?.protein && this.servings) {
    return Math.round(this.nutrition.protein / this.servings);
  }
  return null;
});

// Check if budget-friendly (< $3 per serving)
recipeSchema.virtual('isBudgetFriendly').get(function() {
  if (this.pricePerServing) {
    return this.pricePerServing < 300; // 300 cents = $3
  }
  return null;
});

// ===========================
// METHODS
// ===========================

// Check if recipe matches diet type
recipeSchema.methods.matchesDiet = function(dietType) {
  if (!dietType) return true;
  return this.diets.includes(dietType.toLowerCase());
};

// Check if recipe matches health goal
recipeSchema.methods.matchesHealthGoal = function(healthGoal) {
  if (!healthGoal) return true;
  return this.healthGoals.includes(healthGoal.toLowerCase());
};

// Check if recipe is within calorie range
recipeSchema.methods.isWithinCalorieRange = function(minCal, maxCal) {
  if (!this.nutrition?.calories) return true;
  const calsPerServing = this.caloriesPerServing || this.nutrition.calories;
  
  if (minCal && calsPerServing < minCal) return false;
  if (maxCal && calsPerServing > maxCal) return false;
  
  return true;
};

// Check if recipe has minimum protein
recipeSchema.methods.hasMinimumProtein = function(minProtein) {
  if (!minProtein || !this.nutrition?.protein) return true;
  const proteinPerServing = this.proteinPerServing || this.nutrition.protein;
  return proteinPerServing >= minProtein;
};

// ===========================
// STATIC METHODS
// ===========================

// Find or create recipe from external source
recipeSchema.statics.findOrCreate = async function(recipeData) {
  if (recipeData.source && recipeData.externalId) {
    const { lastFetched, ...dataToInsert } = recipeData;

    // Optimization: Use atomic findOneAndUpdate with upsert
    // This reduces DB calls from 2 to 1 and handles race conditions better.
    // We use runValidators: true to ensure data integrity on updates.
    return await this.findOneAndUpdate(
      { source: recipeData.source, externalId: recipeData.externalId },
      {
        $set: { lastFetched: new Date() },
        $setOnInsert: dataToInsert
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true
      }
    );
  }

  return await this.create(recipeData);
};

// Get popular recipes
recipeSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ savedCount: -1, healthScore: -1 })
    .limit(limit);
};

// Get healthy recipes
recipeSchema.statics.getHealthy = function(limit = 10) {
  return this.find({ 
    isActive: true,
    healthScore: { $gte: 50 }
  })
  .sort({ healthScore: -1 })
  .limit(limit);
};

// Search recipes by ingredients
recipeSchema.statics.searchByIngredients = function(ingredientNames, filters = {}) {
  const query = { isActive: true };

  // Search for recipes containing any of the ingredients
  if (ingredientNames && ingredientNames.length > 0) {
    query['ingredients.name'] = { 
      $in: ingredientNames.map(name => new RegExp(name, 'i')) 
    };
  }

  // Apply filters
  if (filters.diet) {
    query.diets = filters.diet.toLowerCase();
  }

  if (filters.cuisine) {
    query.cuisines = filters.cuisine.toLowerCase();
  }

  if (filters.healthGoal) {
    query.healthGoals = filters.healthGoal.toLowerCase();
  }

  if (filters.maxCalories) {
    query['nutrition.calories'] = { $lte: filters.maxCalories };
  }

  if (filters.minProtein) {
    query['nutrition.protein'] = { $gte: filters.minProtein };
  }

  return this.find(query)
    .sort({ healthScore: -1, savedCount: -1 })
    .limit(filters.limit || 10);
};

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
