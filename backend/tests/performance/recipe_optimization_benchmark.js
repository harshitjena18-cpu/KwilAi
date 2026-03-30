import { performance } from 'perf_hooks';

// Mock data
const mockRecipes = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  healthScore: 50,
  ingredients: Array.from({ length: 15 }, (_, j) => ({
    name: `Ingredient ${j} Type ${i % 5}`
  })),
  diets: ['vegetarian', 'vegan'],
  healthGoals: ['weight-loss', 'high-protein'],
  pricePerServing: 200,
  nutrition: { calories: 400, protein: 30 }
}));

const filters = {
  dietType: 'VEGETARIAN',
  healthGoal: 'WEIGHT-LOSS',
  budget: 'LOW',
  maxCalories: 500,
  minProtein: 20
};

const preferences = {
  healthGoal: 'WEIGHT-LOSS',
  budget: 'LOW',
  ingredients: ['Ingredient 1', 'Ingredient 2', 'Type 1', 'Type 2', 'Chicken']
};

function originalFilter(recipes, filters) {
  const { dietType, healthGoal, budget, maxCalories, minProtein } = filters;

  return recipes.filter(recipe => {
    if (dietType && recipe.diets && !recipe.diets.includes(dietType.toLowerCase())) return false;
    if (healthGoal && recipe.healthGoals && !recipe.healthGoals.includes(healthGoal.toLowerCase())) {
      if (healthGoal === 'weight-loss' && recipe.nutrition?.calories) {
        if (recipe.nutrition.calories > 500) return false;
      } else if (healthGoal === 'high-protein' && recipe.nutrition?.protein) {
        if (recipe.nutrition.protein < 20) return false;
      }
    }
    if (budget && recipe.pricePerServing) {
      const budgetMap = { 'low': 300, 'medium': 600, 'high': 1000 };
      const maxPrice = budgetMap[budget.toLowerCase()] || 600;
      if (recipe.pricePerServing > maxPrice) return false;
    }
    return true;
  });
}

function optimizedFilter(recipes, filters) {
  const { dietType, healthGoal, budget, maxCalories, minProtein } = filters;
  const lowerDietType = dietType?.toLowerCase();
  const lowerHealthGoal = healthGoal?.toLowerCase();
  const lowerBudget = budget?.toLowerCase();

  // Cache budget limit outside loop
  let maxPrice = null;
  if (lowerBudget) {
    const budgetMap = { 'low': 300, 'medium': 600, 'high': 1000 };
    maxPrice = budgetMap[lowerBudget] || 600;
  }

  return recipes.filter(recipe => {
    // Diet filter
    if (lowerDietType && recipe.diets && !recipe.diets.includes(lowerDietType)) return false;

    // Health goal filter
    if (lowerHealthGoal && recipe.healthGoals && !recipe.healthGoals.includes(lowerHealthGoal)) {
      if (lowerHealthGoal === 'weight-loss' && recipe.nutrition?.calories) {
        const cals = recipe.nutrition.calories / (recipe.servings || 1);
        if (cals > 500) return false;
      } else if (lowerHealthGoal === 'high-protein' && recipe.nutrition?.protein) {
        const protein = recipe.nutrition.protein / (recipe.servings || 1);
        if (protein < 20) return false;
      }
    }

    // Budget filter
    if (maxPrice !== null && recipe.pricePerServing) {
      if (recipe.pricePerServing > maxPrice) return false;
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

function originalOptimize(recipes, preferences) {
  const { healthGoal, budget, ingredients = [] } = preferences;

  return recipes.map(recipe => {
    let score = recipe.healthScore || 50;
    if (ingredients.length > 0 && recipe.ingredients) {
      const matchedIngredients = recipe.ingredients.filter(ing =>
        ingredients.some(userIng =>
          ing.name.toLowerCase().includes(userIng.toLowerCase()) ||
          userIng.toLowerCase().includes(ing.name.toLowerCase())
        )
      ).length;
      score += matchedIngredients * 30;
    }
    return { ...recipe, optimizationScore: score };
  });
}

function optimizedOptimize(recipes, preferences) {
  const { healthGoal, budget, ingredients = [] } = preferences;
  const lowerUserIngredients = ingredients.map(ing => ing.toLowerCase());

  return recipes.map(recipe => {
    let score = recipe.healthScore || 50;
    if (lowerUserIngredients.length > 0 && recipe.ingredients) {
      const matchedIngredients = recipe.ingredients.filter(ing => {
        const lowerIngName = ing.name.toLowerCase();
        return lowerUserIngredients.some(userIng =>
          lowerIngName.includes(userIng) ||
          userIng.includes(lowerIngName)
        );
      }).length;
      score += matchedIngredients * 30;
    }
    return { ...recipe, optimizationScore: score };
  });
}

// Run benchmarks
const ITERATIONS = 1000;

let start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  originalFilter(mockRecipes, filters);
}
const filterOriginalTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedFilter(mockRecipes, filters);
}
const filterOptimizedTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  originalOptimize(mockRecipes, preferences);
}
const optimizeOriginalTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedOptimize(mockRecipes, preferences);
}
const optimizeOptimizedTime = performance.now() - start;

console.log('--- BENCHMARK RESULTS ---');
console.log(`Original Filter: ${filterOriginalTime.toFixed(2)}ms`);
console.log(`Optimized Filter: ${filterOptimizedTime.toFixed(2)}ms`);
console.log(`Filter Improvement: ${(((filterOriginalTime - filterOptimizedTime) / filterOriginalTime) * 100).toFixed(2)}%`);

console.log(`Original Optimize: ${optimizeOriginalTime.toFixed(2)}ms`);
console.log(`Optimized Optimize: ${optimizeOptimizedTime.toFixed(2)}ms`);
console.log(`Optimize Improvement: ${(((optimizeOriginalTime - optimizeOptimizedTime) / optimizeOriginalTime) * 100).toFixed(2)}%`);
