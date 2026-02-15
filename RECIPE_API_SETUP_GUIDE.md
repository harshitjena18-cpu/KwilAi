# 🚀 Recipe API Setup Guide

## Quick Start (5 Minutes)

### **Step 1: Get API Keys**

#### **Spoonacular API** (Primary - Required)
```bash
1. Go to: https://spoonacular.com/food-api/console
2. Sign up for FREE account
3. Get API key from dashboard
4. Free tier: 150 requests/day (enough for testing)
```

#### **Edamam Recipe API** (Secondary - Optional)
```bash
1. Go to: https://developer.edamam.com/
2. Sign up for Recipe Search API
3. Get App ID and App Key
4. Free tier: 10 requests/min, 10,000/month
```

#### **Google Gemini AI** (Fallback - Optional)
```bash
1. Go to: https://ai.google.dev/
2. Get API key from console
3. Free tier: 60 requests/min
```

---

### **Step 2: Configure Backend**

#### **Add to `/backend/.env`:**

```env
# Required - Spoonacular
SPOONACULAR_API_KEY=your_spoonacular_key_here

# Optional - Edamam
EDAMAM_APP_ID=your_edamam_app_id_here
EDAMAM_APP_KEY=your_edamam_app_key_here

# Optional - Gemini AI
GEMINI_API_KEY=your_gemini_key_here
```

**Note:** The system works with just Spoonacular API key. Edamam and Gemini are for enhanced results.

---

### **Step 3: Install Dependencies**

```bash
cd backend
npm install axios
```

*All other dependencies should already be installed.*

---

### **Step 4: Test the API**

#### **Start Backend:**
```bash
cd backend
npm run dev
```

#### **Test with curl:**

```bash
# Test 1: Basic suggestions
curl "http://localhost:5000/api/recipes/suggestions?ingredients=chicken,rice"

# Test 2: With filters
curl "http://localhost:5000/api/recipes/suggestions?ingredients=tomato,basil&dietType=vegetarian&cuisine=italian"

# Test 3: Health goal + budget
curl "http://localhost:5000/api/recipes/suggestions?healthGoal=weight-loss&budget=low&maxCalories=400"
```

#### **Expected Response:**

```json
{
  "success": true,
  "count": 10,
  "recipes": [
    {
      "title": "Chicken Fried Rice",
      "image": "https://...",
      "nutrition": {
        "calories": 380,
        "protein": 28,
        "carbs": 45,
        "fat": 10
      },
      "ingredients": [...],
      "steps": [...],
      "healthScore": 75
    },
    // ... 9 more recipes
  ]
}
```

---

## 📝 Usage Examples

### **1. Get Recipes from Pantry Ingredients**

```typescript
import recipeService from '@/services/recipeService';
import pantryService from '@/services/pantryService';

// Get user's pantry ingredients
const { ingredients } = await pantryService.getIngredients();

// Get ingredient names
const ingredientNames = ingredients.map(i => i.ingredientName);

// Get recipe suggestions
const { recipes } = await recipeService.getSuggestions({
  ingredients: ingredientNames,
  limit: 10
});
```

---

### **2. Personalized Search**

```typescript
// Get recipes based on user profile
const { recipes } = await recipeService.getSuggestions({
  ingredients: ['chicken', 'broccoli', 'quinoa'],
  dietType: 'high-protein',
  cuisine: 'mediterranean',
  healthGoal: 'muscle-gain',
  budget: 'medium',
  maxCalories: 600,
  minProtein: 35,
  limit: 10
});
```

---

### **3. Filter by Category**

```typescript
// Get vegan recipes
const { recipes } = await recipeService.getRecipesByDiet('vegan', 10);

// Get Italian recipes
const { recipes } = await recipeService.getRecipesByCuisine('italian', 10);

// Get weight-loss recipes
const { recipes } = await recipeService.getRecipesByHealthGoal('weight-loss', 10);
```

---

### **4. Quick Recipes**

```typescript
// Get recipes under 30 minutes
const { recipes } = await recipeService.getQuickRecipes(10);

// Get budget-friendly recipes
const { recipes } = await recipeService.getBudgetRecipes(10);

// Get healthy recipes
const { recipes } = await recipeService.getHealthyRecipes(10);
```

---

## 🔧 Troubleshooting

### **Issue: "Spoonacular API error"**

**Solution:**
1. Check API key is correct in `.env`
2. Verify you haven't exceeded daily limit (150/day)
3. Check Spoonacular dashboard for quota usage
4. Wait 24 hours for quota reset

---

### **Issue: "No recipes returned"**

**Solutions:**
1. **Too many filters:** Reduce filter strictness
2. **Uncommon ingredients:** Try more common ingredients
3. **API quotas exceeded:** Check all API dashboards
4. **Enable Gemini AI:** Add `GEMINI_API_KEY` to generate custom recipes

---

### **Issue: "Gemini AI generation failed"**

**Solutions:**
1. Check Gemini API key is valid
2. Verify API is enabled in Google Cloud Console
3. Check rate limits (60 requests/min)
4. Review prompt structure in logs

---

## 📊 API Quota Management

### **Free Tier Limits:**

| API | Requests/Day | Requests/Month | Notes |
|-----|--------------|----------------|-------|
| **Spoonacular** | 150 | ~4,500 | Primary source |
| **Edamam** | ~14,400 | ~300,000 | 10/min limit |
| **Gemini AI** | ~86,400 | ~2.6M | 60/min limit |

### **Optimization Tips:**

1. **Cache aggressively:** Recipes are saved to MongoDB after first fetch
2. **Use MongoDB first:** Check database before calling APIs
3. **Batch requests:** Get multiple recipes in one API call
4. **Implement rate limiting:** Prevent users from spamming requests
5. **Monitor usage:** Track API calls in logs

---

## 🎯 Production Recommendations

### **1. Upgrade to Paid Plans**

**Spoonacular:**
- **Basic:** $49/month (unlimited requests)
- **Advanced:** $149/month (premium features)

**Edamam:**
- **Developer:** $49/month (higher rate limits)
- **Startup:** $249/month (commercial use)

**Gemini AI:**
- Currently free with generous limits
- Pricing TBA for production

---

### **2. Implement Caching Strategy**

```javascript
// Example caching logic
async getSuggestions(params) {
  // 1. Check MongoDB cache first
  const cacheKey = generateCacheKey(params);
  const cached = await Recipe.find({ cacheKey });
  
  if (cached.length > 0) {
    return cached; // Return cached results
  }
  
  // 2. Fetch from APIs
  const recipes = await this.fetchFromAPIs(params);
  
  // 3. Save to cache
  await this.saveToCache(recipes, cacheKey);
  
  return recipes;
}
```

---

### **3. Monitor API Usage**

```javascript
// Add logging middleware
app.use('/api/recipes', (req, res, next) => {
  console.log(`Recipe API called: ${req.path}`, {
    params: req.query,
    timestamp: new Date(),
    ip: req.ip
  });
  next();
});

// Track API calls in database
await ApiUsage.create({
  endpoint: '/recipes/suggestions',
  params: req.query,
  source: 'spoonacular',
  timestamp: new Date()
});
```

---

## 🔒 Security Best Practices

### **1. Protect API Keys**

```env
# ❌ NEVER commit .env to git
# ✅ Add to .gitignore

# .gitignore
.env
.env.local
.env.production
```

### **2. Use Environment Variables**

```javascript
// ❌ Don't hardcode keys
const apiKey = 'abc123...';

// ✅ Use environment variables
const apiKey = process.env.SPOONACULAR_API_KEY;
```

### **3. Implement Rate Limiting**

```javascript
import rateLimit from 'express-rate-limit';

const recipeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 min
  message: 'Too many recipe requests, please try again later'
});

app.use('/api/recipes', recipeLimiter);
```

---

## 📈 Performance Optimization

### **1. Database Indexing**

Already implemented in Recipe model:
```javascript
recipeSchema.index({ title: 'text', summary: 'text' });
recipeSchema.index({ source: 1, externalId: 1 });
recipeSchema.index({ cuisines: 1 });
recipeSchema.index({ diets: 1 });
```

### **2. Response Compression**

Already enabled in server.js:
```javascript
import compression from 'compression';
app.use(compression());
```

### **3. Pagination**

```javascript
// Limit results to prevent overload
const { recipes } = await recipeService.getSuggestions({
  ingredients: ['chicken'],
  limit: 10 // Don't fetch more than needed
});
```

---

## ✅ Testing Checklist

- [ ] Spoonacular API key works
- [ ] Edamam API credentials work (optional)
- [ ] Gemini API key works (optional)
- [ ] `/api/recipes/suggestions` returns results
- [ ] Filtering by diet type works
- [ ] Filtering by cuisine works
- [ ] Filtering by health goal works
- [ ] Budget filtering works (if Spoonacular has data)
- [ ] Calorie filtering works
- [ ] Protein filtering works
- [ ] Recipes are cached in MongoDB
- [ ] Gemini AI generates recipes when APIs fail
- [ ] Frontend can fetch and display recipes
- [ ] Save/unsave recipe functionality works
- [ ] User authentication works for saved recipes

---

## 🎉 You're Ready!

Your recipe API integration is complete and ready to use!

### **Next Steps:**

1. ✅ Get API keys (5 min)
2. ✅ Add to `.env` (1 min)
3. ✅ Test API endpoints (2 min)
4. ✅ Integrate with frontend (already done!)
5. 🚀 Deploy to production

---

## 📞 Support

**Issues?**
- Check API dashboards for quota usage
- Review error logs in console
- Verify API keys are correct
- Test with simple queries first
- Enable Gemini AI for fallback recipes

**Need Help?**
- Spoonacular Docs: https://spoonacular.com/food-api/docs
- Edamam Docs: https://developer.edamam.com/edamam-docs-recipe-api
- Gemini AI Docs: https://ai.google.dev/docs

---

**Happy Cooking! 🍳👨‍🍳**
