# 🎯 Intelligent Recipe Ranking System

## Overview

The Kwil AI recipe ranking system uses a sophisticated multi-factor scoring algorithm to deliver personalized recipe recommendations based on user preferences, health goals, budget constraints, and ingredient availability.

---

## Scoring Algorithm

### Total Score Calculation

```
Total Score = Base Health Score (50)
            + Ingredient Match Score (0-30)
            + Health Goal Score (0-25)
            + Budget Match Score (0-20)
            + Quality Factors (0-25)
```

**Score Range**: 50-150 points

---

## Scoring Components

### 1. Ingredient Match Score (0-30 points)

Prioritizes recipes that use ingredients the user already has.

**Formula**:
```javascript
matchedIngredients = count of user ingredients found in recipe
ingredientMatchPercentage = matchedIngredients / userIngredients.length
ingredientScore = ingredientMatchPercentage × 30
```

**Examples**:
- User has: `["chicken", "rice", "broccoli"]` (3 ingredients)
- Recipe uses: `["chicken", "rice", "soy sauce", "garlic"]`
- Match: 2 out of 3 = 66.7% = **20 points**

**Benefits**:
- Reduces food waste
- Uses available pantry items
- Lower shopping costs

---

### 2. Health Goal Scoring (0-25 points)

Adapts scoring based on specific health objectives.

#### 🏃 Weight Loss (0-25 points)

Prioritizes low-calorie recipes:

| Calories/Serving | Score | Description |
|-----------------|-------|-------------|
| < 300 cal       | 25    | Excellent   |
| 300-399 cal     | 20    | Very Good   |
| 400-499 cal     | 15    | Good        |
| 500-599 cal     | 10    | Moderate    |
| ≥ 600 cal       | 0     | No bonus    |

**Example**:
```json
{
  "recipe": "Grilled Chicken Salad",
  "nutrition": { "calories": 280, "servings": 1 },
  "healthGoalScore": 25
}
```

---

#### 💪 Muscle Gain (0-25 points)

Prioritizes high-protein recipes:

| Protein/Serving | Score | Description |
|----------------|-------|-------------|
| ≥ 40g          | 25    | Excellent   |
| 30-39g         | 20    | Very Good   |
| 25-29g         | 15    | Good        |
| 20-24g         | 10    | Moderate    |
| < 20g          | 0     | No bonus    |

**Example**:
```json
{
  "recipe": "Protein-Packed Steak Bowl",
  "nutrition": { "protein": 42, "servings": 1 },
  "healthGoalScore": 25
}
```

---

#### 🥗 High Protein (0-25 points)

Similar to muscle gain:

| Protein/Serving | Score |
|----------------|-------|
| ≥ 35g          | 25    |
| 25-34g         | 20    |
| 20-24g         | 15    |
| 15-19g         | 10    |
| < 15g          | 0     |

---

#### 🥑 Low-Carb (0-25 points)

Prioritizes low-carbohydrate recipes:

| Carbs/Serving | Score | Description |
|--------------|-------|-------------|
| < 15g        | 25    | Keto-level  |
| 15-29g       | 20    | Very Low    |
| 30-49g       | 15    | Low         |
| ≥ 50g        | 0     | No bonus    |

---

#### ❤️ Heart Health (0-25 points)

Prioritizes recipes with high health scores:

| Health Score | Points |
|-------------|--------|
| 80-100      | 25     |
| 70-79       | 20     |
| 60-69       | 15     |
| < 60        | 0      |

---

#### 🏷️ Generic Health Goal Match (+15 points)

Additional bonus if recipe tags match the user's health goal.

```javascript
if (recipe.healthGoals.includes(userHealthGoal)) {
  score += 15;
}
```

---

### 3. Budget Scoring (0-20 points)

Matches recipes to user's budget preference.

#### Budget Tiers

| Budget Level | Ideal Price/Serving | Max Price/Serving |
|-------------|-------------------|------------------|
| **Low**     | ≤ $2.00           | ≤ $3.00         |
| **Medium**  | ≤ $4.00           | ≤ $6.00         |
| **High**    | ≤ $7.00           | ≤ $10.00        |

#### Scoring Formula

```javascript
if (price <= ideal) {
  score = 20; // Perfect budget match
} else if (price <= max) {
  ratio = (max - price) / (max - ideal);
  score = ratio × 15; // Proportional (0-15 points)
} else {
  score = 0; // Over budget, no bonus
}
```

**Examples**:

**Low Budget**:
- Recipe at $1.50/serving → **20 points** (perfect)
- Recipe at $2.50/serving → **7.5 points** (proportional)
- Recipe at $4.00/serving → **0 points** (over budget)

**Medium Budget**:
- Recipe at $3.50/serving → **20 points** (perfect)
- Recipe at $5.00/serving → **10 points** (proportional)
- Recipe at $7.00/serving → **0 points** (over budget)

#### Budget-Friendly Bonus (+10 points)

If budget is "low" and recipe is tagged as budget-friendly:
```javascript
if (budget === 'low' && recipe.isBudgetFriendly) {
  score += 10;
}
```

---

### 4. Quality Factors (0-25 points)

Additional scoring based on recipe quality metrics.

#### User Ratings (0-10 points)

```javascript
ratingScore = recipe.rating × 2
// 5-star rating = 10 points
// 4-star rating = 8 points
// 3-star rating = 6 points
```

#### Spoonacular Score (0-10 points)

```javascript
spoonacularScore = recipe.spoonacularScore × 0.1
// Score of 100 = 10 points
// Score of 75 = 7.5 points
```

#### Popularity (0-5 points)

```javascript
popularityScore = Math.min(recipe.savedCount × 0.1, 5)
// Capped at 5 points
// 50 saves = 5 points
// 20 saves = 2 points
```

#### Quick Recipe Bonus (0-5 points)

```javascript
if (readyInMinutes <= 30) {
  score += 5;
} else if (readyInMinutes <= 45) {
  score += 3;
}
```

---

## Example Calculations

### Example 1: Weight Loss + Low Budget

**User Profile**:
- Health Goal: Weight Loss
- Budget: Low
- Ingredients: `["chicken", "lettuce", "tomato"]`

**Recipe: Chicken Caesar Salad**
```json
{
  "title": "Grilled Chicken Caesar Salad",
  "healthScore": 70,
  "nutrition": {
    "calories": 320,
    "protein": 35,
    "carbs": 12,
    "fat": 15
  },
  "servings": 1,
  "pricePerServing": 250, // $2.50
  "readyInMinutes": 20,
  "rating": 4.5,
  "savedCount": 120,
  "ingredients": ["chicken", "lettuce", "tomato", "parmesan", "croutons"]
}
```

**Score Calculation**:
1. Base Health Score: **70 points**
2. Ingredient Match: 3/3 = 100% × 30 = **30 points**
3. Weight Loss (320 cal): **20 points**
4. Budget (low, $2.50): **7.5 points** (proportional)
5. Rating (4.5 stars): 4.5 × 2 = **9 points**
6. Popularity: min(120 × 0.1, 5) = **5 points**
7. Quick Recipe (20 min): **5 points**

**Total Score**: 70 + 30 + 20 + 7.5 + 9 + 5 + 5 = **146.5 points** ⭐

---

### Example 2: Muscle Gain + Medium Budget

**User Profile**:
- Health Goal: Muscle Gain
- Budget: Medium
- Ingredients: `["beef", "rice"]`

**Recipe: Beef and Broccoli Stir-Fry**
```json
{
  "title": "Beef and Broccoli Stir-Fry",
  "healthScore": 65,
  "nutrition": {
    "calories": 520,
    "protein": 42,
    "carbs": 45,
    "fat": 18
  },
  "servings": 1,
  "pricePerServing": 450, // $4.50
  "readyInMinutes": 25,
  "rating": 4.8,
  "spoonacularScore": 85,
  "ingredients": ["beef", "broccoli", "soy sauce", "garlic", "ginger"]
}
```

**Score Calculation**:
1. Base Health Score: **65 points**
2. Ingredient Match: 1/2 = 50% × 30 = **15 points**
3. Muscle Gain (42g protein): **25 points**
4. Budget (medium, $4.50): **15 points** (within ideal)
5. Rating (4.8 stars): 4.8 × 2 = **9.6 points**
6. Spoonacular: 85 × 0.1 = **8.5 points**
7. Quick Recipe (25 min): **5 points**

**Total Score**: 65 + 15 + 25 + 15 + 9.6 + 8.5 + 5 = **143.1 points** ⭐

---

## API Usage

### Get Ranked Recipes

**Request**:
```bash
GET /api/recipes/suggestions?ingredients=chicken,rice&healthGoal=weight-loss&budget=low&limit=5
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "recipes": [
    {
      "title": "Grilled Chicken Salad",
      "optimizationScore": 146.5,
      "ingredientMatchPercentage": 100,
      "nutrition": { "calories": 320, "protein": 35 },
      "pricePerServing": 250
    },
    {
      "title": "Chicken Rice Bowl",
      "optimizationScore": 138.2,
      "ingredientMatchPercentage": 100,
      "nutrition": { "calories": 380, "protein": 32 },
      "pricePerServing": 280
    }
  ]
}
```

---

## Ranking Strategies

### 1. Maximize Ingredient Usage

```bash
GET /api/recipes/suggestions?ingredients=chicken,rice,broccoli,garlic,soy
```

- Recipes using all 5 ingredients score highest
- Reduces shopping list
- Minimizes food waste

### 2. Optimize for Health Goals

**Weight Loss**:
```bash
GET /api/recipes/suggestions?healthGoal=weight-loss&maxCalories=400
```

**Muscle Gain**:
```bash
GET /api/recipes/suggestions?healthGoal=muscle-gain&minProtein=30
```

### 3. Budget-Conscious Cooking

```bash
GET /api/recipes/suggestions?budget=low&cuisine=italian
```

- Prioritizes affordable recipes
- Filters out expensive ingredients
- Suggests budget-friendly alternatives

### 4. Quick Meals

```bash
GET /api/recipes/quick
```

- Recipes under 30 minutes
- Extra points for speed
- Perfect for busy weeknights

---

## Performance Optimization

### Caching Strategy

1. **Recipe Cache**: Store recipes in MongoDB
2. **Score Cache**: Pre-calculate scores for common preferences
3. **Ingredient Index**: Fast lookup for ingredient matches

### Database Indexes

```javascript
// Recipe model indexes
recipeSchema.index({ healthScore: -1 });
recipeSchema.index({ pricePerServing: 1 });
recipeSchema.index({ 'nutrition.calories': 1 });
recipeSchema.index({ 'nutrition.protein': -1 });
recipeSchema.index({ readyInMinutes: 1 });
```

---

## Testing

### Test Cases

```javascript
// Test 1: Ingredient match
const recipes = await recipeService.getSuggestions({
  ingredients: ['chicken', 'rice', 'broccoli'],
  limit: 5
});

console.assert(recipes[0].ingredientMatchPercentage >= 66);

// Test 2: Weight loss optimization
const weightLossRecipes = await recipeService.getSuggestions({
  healthGoal: 'weight-loss',
  maxCalories: 400,
  limit: 5
});

console.assert(weightLossRecipes.every(r => 
  r.nutrition.calories / r.servings <= 400
));

// Test 3: Budget filtering
const budgetRecipes = await recipeService.getSuggestions({
  budget: 'low',
  limit: 5
});

console.assert(budgetRecipes.every(r => 
  r.pricePerServing <= 300
));
```

---

## Future Enhancements

- [ ] Machine learning-based personalization
- [ ] User feedback loop for score refinement
- [ ] Dietary restriction boosting
- [ ] Seasonal ingredient bonuses
- [ ] Regional price adjustments
- [ ] Dynamic weight adjustment based on user behavior
- [ ] A/B testing for ranking algorithms
- [ ] Collaborative filtering (users with similar tastes)

---

## Analytics

Track ranking effectiveness:

```javascript
{
  "averageOptimizationScore": 125.3,
  "topScoringFactor": "ingredientMatch",
  "userSatisfactionRate": 87.5,
  "recipeConversionRate": 45.2
}
```

---

**Last Updated**: February 2026  
**Version**: 1.0.0
