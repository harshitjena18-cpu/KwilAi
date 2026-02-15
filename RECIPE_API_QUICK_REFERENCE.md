# 📋 Recipe API Quick Reference

## 🔥 Most Used Endpoints

### **1. Get Personalized Suggestions**
```bash
GET /api/recipes/suggestions

# All parameters optional
?ingredients=chicken,rice,broccoli
&dietType=vegetarian|vegan|gluten-free|ketogenic|paleo|pescatarian
&cuisine=italian|mexican|asian|indian|mediterranean|american
&healthGoal=weight-loss|muscle-gain|heart-health|high-protein|low-carb
&budget=low|medium|high
&maxCalories=500
&minProtein=30
&limit=10
```

**Example:**
```bash
GET /api/recipes/suggestions?ingredients=chicken,broccoli&dietType=high-protein&healthGoal=muscle-gain&maxCalories=600&minProtein=35
```

---

### **2. Search by Text**
```bash
GET /api/recipes/search?q=pasta&limit=10
```

---

### **3. Get Recipe Details**
```bash
GET /api/recipes/:id
```

---

## 📂 Category Endpoints

### **Popular Recipes**
```bash
GET /api/recipes/popular?limit=10
```

### **Healthy Recipes**
```bash
GET /api/recipes/healthy?limit=10
```

### **Quick Recipes** (< 30 min)
```bash
GET /api/recipes/quick?limit=10
```

### **Budget-Friendly** (< $3/serving)
```bash
GET /api/recipes/budget-friendly?limit=10
```

---

## 🍽️ Filter Endpoints

### **By Cuisine**
```bash
GET /api/recipes/cuisine/italian?limit=10
GET /api/recipes/cuisine/mexican?limit=10
GET /api/recipes/cuisine/asian?limit=10
GET /api/recipes/cuisine/mediterranean?limit=10
```

### **By Diet**
```bash
GET /api/recipes/diet/vegetarian?limit=10
GET /api/recipes/diet/vegan?limit=10
GET /api/recipes/diet/gluten-free?limit=10
GET /api/recipes/diet/ketogenic?limit=10
GET /api/recipes/diet/paleo?limit=10
```

### **By Health Goal**
```bash
GET /api/recipes/health-goal/weight-loss?limit=10
GET /api/recipes/health-goal/muscle-gain?limit=10
GET /api/recipes/health-goal/heart-health?limit=10
GET /api/recipes/health-goal/high-protein?limit=10
GET /api/recipes/health-goal/low-carb?limit=10
GET /api/recipes/health-goal/low-fat?limit=10
```

---

## 🔐 User Endpoints (Auth Required)

### **Save Recipe**
```bash
POST /api/recipes/:id/save
Authorization: Bearer <token>
```

### **Unsave Recipe**
```bash
DELETE /api/recipes/:id/save
Authorization: Bearer <token>
```

### **Get Saved Recipes**
```bash
GET /api/recipes/saved?limit=20
Authorization: Bearer <token>
```

---

## 📊 Response Format

```json
{
  "success": true,
  "count": 10,
  "recipes": [
    {
      "_id": "...",
      "title": "Chicken Stir Fry",
      "image": "https://...",
      "source": "spoonacular",
      "ingredients": [
        {
          "name": "chicken breast",
          "amount": 1,
          "unit": "lb",
          "original": "1 lb chicken breast"
        }
      ],
      "steps": [
        {
          "number": 1,
          "instruction": "Heat oil in pan",
          "duration": 5
        }
      ],
      "nutrition": {
        "calories": 380,
        "protein": 35,
        "carbs": 28,
        "fat": 12,
        "fiber": 5,
        "sugar": 4
      },
      "readyInMinutes": 25,
      "servings": 4,
      "pricePerServing": 425,
      "cuisines": ["asian"],
      "diets": ["high-protein"],
      "healthGoals": ["muscle-gain"],
      "healthScore": 85,
      "difficulty": "easy",
      "rating": 4.5
    }
  ]
}
```

---

## 🎯 Common Use Cases

### **1. Recipes from Pantry**
```bash
# Get ingredients from pantry
GET /api/pantry

# Use in recipe suggestions
GET /api/recipes/suggestions?ingredients=tomato,basil,mozzarella
```

---

### **2. Diet-Specific Meal Plan**
```bash
# Vegan breakfast
GET /api/recipes/suggestions?dietType=vegan&mealType=breakfast&limit=5

# Keto lunch
GET /api/recipes/suggestions?dietType=ketogenic&maxCarbs=20&limit=5

# Protein-rich dinner
GET /api/recipes/suggestions?minProtein=40&limit=5
```

---

### **3. Weight Loss Program**
```bash
GET /api/recipes/suggestions?healthGoal=weight-loss&maxCalories=400&budget=low&limit=10
```

---

### **4. Muscle Gain Program**
```bash
GET /api/recipes/suggestions?healthGoal=muscle-gain&minProtein=35&cuisine=any&limit=10
```

---

### **5. Quick Weeknight Dinners**
```bash
GET /api/recipes/quick?limit=10
```

---

## 🔍 Filter Values Reference

### **Diet Types**
- `vegetarian`
- `vegan`
- `gluten-free`
- `ketogenic`
- `paleo`
- `pescatarian`
- `whole30`

### **Cuisines**
- `italian`
- `mexican`
- `asian`
- `chinese`
- `japanese`
- `thai`
- `indian`
- `mediterranean`
- `greek`
- `french`
- `american`
- `british`
- `korean`
- `vietnamese`
- `middle-eastern`

### **Health Goals**
- `weight-loss` (< 400 cal)
- `muscle-gain` (> 30g protein)
- `heart-health` (low sodium)
- `diabetes-friendly` (low sugar)
- `high-protein` (> 30g)
- `low-carb` (< 50g)
- `low-fat` (< 15g)

### **Budget**
- `low` (< $3 per serving)
- `medium` ($3-6 per serving)
- `high` (> $6 per serving)

### **Difficulty**
- `easy` (< 20 min, few ingredients)
- `medium` (20-60 min)
- `hard` (> 60 min, many steps)

---

## ⚡ Performance Tips

### **1. Use Limit Parameter**
```bash
# ❌ Don't fetch unlimited
GET /api/recipes/suggestions?ingredients=chicken

# ✅ Always specify limit
GET /api/recipes/suggestions?ingredients=chicken&limit=10
```

### **2. Cache Responses**
```typescript
// Frontend caching
const cachedRecipes = localStorage.getItem('recipes');
if (cachedRecipes) {
  return JSON.parse(cachedRecipes);
}

const { recipes } = await recipeService.getSuggestions(params);
localStorage.setItem('recipes', JSON.stringify(recipes));
```

### **3. Use Specific Filters**
```bash
# ❌ Too broad (slow)
GET /api/recipes/suggestions?limit=100

# ✅ Specific filters (fast)
GET /api/recipes/suggestions?cuisine=italian&dietType=vegan&limit=10
```

---

## 🚨 Error Handling

### **Common Errors**

```javascript
// 400 - Bad Request
{
  "success": false,
  "message": "Invalid diet type. Valid types: vegetarian, vegan, ..."
}

// 404 - Not Found
{
  "success": false,
  "message": "Recipe not found"
}

// 401 - Unauthorized (for protected routes)
{
  "success": false,
  "message": "Not authorized to access this route"
}

// 500 - Server Error
{
  "success": false,
  "message": "Spoonacular API error: ..."
}
```

### **Handle in Frontend**

```typescript
try {
  const { recipes } = await recipeService.getSuggestions(params);
  setRecipes(recipes);
} catch (error: any) {
  if (error.response?.status === 401) {
    // Redirect to login
    navigate('/login');
  } else {
    // Show error message
    toast.error(error.response?.data?.message || 'Failed to fetch recipes');
  }
}
```

---

## 📱 Frontend Integration

### **React Hook Example**

```typescript
import { useState, useEffect } from 'react';
import recipeService from '@/services/recipeService';

function useRecipeSuggestions(params) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const { recipes } = await recipeService.getSuggestions(params);
        setRecipes(recipes);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [params]);

  return { recipes, loading, error };
}

// Usage
function RecipeList() {
  const { recipes, loading, error } = useRecipeSuggestions({
    ingredients: ['chicken', 'rice'],
    dietType: 'high-protein',
    limit: 10
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {recipes.map(recipe => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}
```

---

## 🎯 Complete Example

### **Build a Meal Planner**

```typescript
// 1. Get user's pantry ingredients
const { ingredients } = await pantryService.getIngredients();
const ingredientNames = ingredients.map(i => i.ingredientName);

// 2. Get user's diet preferences
const { dietType, healthGoal } = user.preferences;

// 3. Get breakfast recipes
const breakfast = await recipeService.getSuggestions({
  ingredients: ingredientNames,
  dietType,
  healthGoal,
  maxCalories: 400,
  limit: 3
});

// 4. Get lunch recipes
const lunch = await recipeService.getSuggestions({
  ingredients: ingredientNames,
  dietType,
  healthGoal,
  maxCalories: 600,
  limit: 3
});

// 5. Get dinner recipes
const dinner = await recipeService.getSuggestions({
  ingredients: ingredientNames,
  dietType,
  healthGoal,
  maxCalories: 700,
  limit: 3
});

// 6. Calculate daily nutrition
const totalCalories = [...breakfast, ...lunch, ...dinner]
  .reduce((sum, r) => sum + (r.nutrition.calories || 0), 0);

const totalProtein = [...breakfast, ...lunch, ...dinner]
  .reduce((sum, r) => sum + (r.nutrition.protein || 0), 0);
```

---

## 🎉 Quick Start Commands

```bash
# Get started in 3 commands!

# 1. Get simple suggestions
curl "http://localhost:5000/api/recipes/suggestions?ingredients=chicken"

# 2. Get vegan Italian recipes
curl "http://localhost:5000/api/recipes/suggestions?dietType=vegan&cuisine=italian"

# 3. Get high-protein recipes
curl "http://localhost:5000/api/recipes/suggestions?minProtein=35&healthGoal=muscle-gain"
```

---

**Need more help?** Check out:
- `/RECIPE_API_INTEGRATION_COMPLETE.md` - Full documentation
- `/RECIPE_API_SETUP_GUIDE.md` - Setup instructions
- Backend API: `http://localhost:5000/api/recipes/*`

**Happy Cooking! 🍳**
