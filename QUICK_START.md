# 🚀 Quick Start Guide - Recipe API Integration

## ✅ Error Fixed

The `axios module not found` error has been **FIXED**. The axios package is now installed and ready to use.

---

## ⚡ 3-Minute Setup

### **Step 1: Get Spoonacular API Key (2 minutes)**

1. Go to: https://spoonacular.com/food-api/console
2. Sign up (FREE)
3. Copy your API key

### **Step 2: Configure Backend (30 seconds)**

Edit `/backend/.env`:

```env
SPOONACULAR_API_KEY=paste_your_key_here
```

### **Step 3: Start Servers (30 seconds)**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (already running)
# Just refresh your browser
```

---

## ✅ Test It Works

### **Option A: Browser Test**

Open: http://localhost:5000/api/recipes/suggestions?ingredients=chicken

You should see JSON with 10 recipes.

### **Option B: Code Test**

Add to any React component:

```typescript
import { useEffect, useState } from 'react';
import recipeService from '@/services/recipeService';

function TestRecipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    recipeService.getSuggestions({ 
      ingredients: ['chicken', 'rice'],
      limit: 5 
    })
      .then(res => setRecipes(res.recipes))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Found {recipes.length} recipes!</h2>
      {recipes.map(r => (
        <div key={r._id}>
          <h3>{r.title}</h3>
          <p>Calories: {r.nutrition.calories}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Common Use Cases

### **1. Get Recipes from Pantry**

```typescript
const { ingredients } = await pantryService.getIngredients();
const ingredientNames = ingredients.map(i => i.ingredientName);

const { recipes } = await recipeService.getSuggestions({
  ingredients: ingredientNames,
  limit: 10
});
```

### **2. Filter by Diet**

```typescript
const { recipes } = await recipeService.getSuggestions({
  dietType: 'vegetarian',
  cuisine: 'italian',
  limit: 10
});
```

### **3. Health Goal Recipes**

```typescript
const { recipes } = await recipeService.getSuggestions({
  healthGoal: 'weight-loss',
  maxCalories: 400,
  budget: 'low',
  limit: 10
});
```

### **4. High-Protein Meals**

```typescript
const { recipes } = await recipeService.getSuggestions({
  minProtein: 35,
  healthGoal: 'muscle-gain',
  limit: 10
});
```

---

## 📋 Available Methods

```typescript
// Get personalized suggestions
recipeService.getSuggestions(params)

// Search by text
recipeService.searchRecipes(query, limit)

// Get by ID
recipeService.getRecipeById(id)

// Get popular
recipeService.getPopularRecipes(limit)

// Get healthy
recipeService.getHealthyRecipes(limit)

// Get quick (<30 min)
recipeService.getQuickRecipes(limit)

// Get budget-friendly
recipeService.getBudgetRecipes(limit)

// Get by cuisine
recipeService.getRecipesByCuisine(cuisine, limit)

// Get by diet
recipeService.getRecipesByDiet(diet, limit)

// Get by health goal
recipeService.getRecipesByHealthGoal(goal, limit)

// Save recipe (auth required)
recipeService.saveRecipe(recipeId)

// Unsave recipe (auth required)
recipeService.unsaveRecipe(recipeId)

// Get saved recipes (auth required)
recipeService.getSavedRecipes(limit)
```

---

## 🔑 Filter Options

### **Diets:**
```
vegetarian, vegan, gluten-free, ketogenic, 
paleo, pescatarian, whole30
```

### **Cuisines:**
```
italian, mexican, asian, chinese, japanese, thai, 
indian, mediterranean, greek, french, american
```

### **Health Goals:**
```
weight-loss, muscle-gain, heart-health, 
diabetes-friendly, high-protein, low-carb, low-fat
```

### **Budget:**
```
low (<$3), medium ($3-6), high (>$6)
```

---

## 🎯 Complete Example

```typescript
import { useState, useEffect } from 'react';
import pantryService from '@/services/pantryService';
import recipeService from '@/services/recipeService';

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipes() {
      try {
        // Get user's pantry
        const { ingredients } = await pantryService.getIngredients();
        const ingredientNames = ingredients.map(i => i.ingredientName);

        // Get recipes using pantry ingredients
        const { recipes } = await recipeService.getSuggestions({
          ingredients: ingredientNames,
          dietType: 'vegetarian', // From user profile
          healthGoal: 'weight-loss',
          maxCalories: 500,
          budget: 'medium',
          limit: 12
        });

        setRecipes(recipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRecipes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {recipes.map(recipe => (
        <div key={recipe._id} className="recipe-card">
          <img 
            src={recipe.image || '/placeholder.jpg'} 
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <h3 className="font-bold text-lg mt-2">{recipe.title}</h3>
          
          <div className="flex gap-4 mt-2">
            <span>⏱️ {recipe.readyInMinutes}m</span>
            <span>🔥 {recipe.nutrition.calories} cal</span>
            <span>💪 {recipe.nutrition.protein}g protein</span>
          </div>
          
          <div className="flex gap-2 mt-2">
            {recipe.diets.map(diet => (
              <span key={diet} className="badge">{diet}</span>
            ))}
          </div>
          
          <button 
            onClick={() => saveRecipe(recipe._id)}
            className="btn-primary mt-4 w-full"
          >
            Save Recipe
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Success Checklist

After setup, you should see:

- [x] No errors in browser console
- [x] Backend shows "Kwil AI Backend Server Started"
- [x] Recipe API returns data
- [x] Frontend can fetch recipes
- [x] Recipe cards display in UI

---

## 🆘 Troubleshooting

### **Still seeing axios error?**

1. Restart dev server (Ctrl+C, then `npm run dev`)
2. Clear cache: `rm -rf .vite node_modules && npm install`
3. Check `/TROUBLESHOOTING.md` for detailed help

### **No recipes returned?**

1. Check Spoonacular API key in `/backend/.env`
2. Verify backend is running on port 5000
3. Check browser console for errors
4. Try simpler query: `?ingredients=chicken`

### **API quota exceeded?**

Free tier: 150 requests/day

**Solutions:**
- Wait 24 hours for reset
- Add Edamam & Gemini keys for fallback
- Upgrade to paid plan ($49/month unlimited)

---

## 📚 Documentation

- **Full Docs:** `/RECIPE_API_INTEGRATION_COMPLETE.md`
- **Setup Guide:** `/RECIPE_API_SETUP_GUIDE.md`
- **API Reference:** `/RECIPE_API_QUICK_REFERENCE.md`
- **Troubleshooting:** `/TROUBLESHOOTING.md`

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just:

1. ✅ Add Spoonacular API key to `/backend/.env`
2. ✅ Restart backend server
3. ✅ Start building amazing recipe features!

---

**Happy Coding! 🚀🍳**
