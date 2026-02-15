# Kwil AI - Navigation Flow Map

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         SPLASH SCREEN (/)                        │
│                                                                  │
│  • Animated logo with neon glow                                 │
│  • 3-second auto-redirect                                       │
│  • Checks localStorage for onboarding status                    │
└──────────────────┬──────────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────┐
│  ONBOARDING   │    │   HOME/DASH    │
│ (New User)    │    │ (Returning)    │
└───────────────┘    └────────────────┘
        │
        │ 3 Screens Carousel
        │ "Get Started"
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN/AUTH (/auth)                          │
│                                                                  │
│  • Email/Password fields                                        │
│  • Social login (Google, Phone)                                 │
│  • "Login" button → /preferences                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PREFERENCES (/preferences)                      │
│                                                                  │
│  • Diet Type Selection (6 options)                              │
│  • Cuisine Preferences (4 options)                              │
│  • Nutritional Goals (3 options)                                │
│  • Budget Slider (₹50-₹500)                                     │
│  • Progress: 4/4 sections required                              │
│  • "Continue" → /dashboard (sets onboarding complete)           │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MAIN APP (/app/home)                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      DASHBOARD                            │  │
│  │  • User greeting                                          │  │
│  │  • Quick action chips                                     │  │
│  │  • Stats cards (calories, meals, streak)                 │  │
│  │  • AI recipe recommendations                             │  │
│  │  • Prominent SCAN FAB button                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────── BOTTOM NAVIGATION ──────────────────────┐   │
│  │  🏠 Home  |  🔍 Search  |  👨‍🍳 Recipes  |  📊 Health  |  👤 Profile │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │          │
         │              │              │              │          │
    ┌────┘         ┌────┘         ┌────┘         ┌────┘     ┌────┘
    │              │              │              │          │
    ▼              ▼              ▼              ▼          ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ SCAN   │  │ SEARCH   │  │ RECIPES  │  │ HEALTH   │  │ PROFILE  │
│ CAMERA │  │ /search  │  │ /recipes │  │ /health  │  │ /profile │
└────────┘  └──────────┘  └────┬─────┘  └──────────┘  └──────────┘
    │                            │
    │                            ▼
    │                      ┌──────────────┐
    │                      │ RECIPE       │
    │                      │ DETAIL       │
    │                      │ /recipe/:id  │
    │                      └──────┬───────┘
    │                             │
    └─────────────┬───────────────┴───────────────┐
                  │                               │
                  ▼                               ▼
         ┌─────────────────┐          ┌────────────────────┐
         │  SCAN RESULTS   │          │  COOKING MODE      │
         │  (AI Detection) │          │  /recipes/:id/cook │
         │  /app/scanner   │          └────────────────────┘
         └────────┬────────┘
                  │
                  │ "Find Recipes"
                  │
                  ▼
         ┌─────────────────┐
         │  RECIPE LIST    │
         │  /app/recipes   │
         └─────────────────┘
```

---

## Detailed Navigation Paths

### **1. Onboarding Flow** (First-Time Users)
```
/ → /onboarding → /auth → /preferences → /app/home
```

### **2. Returning User Flow**
```
/ → /app/home
```

### **3. Recipe Discovery Flow**
```
/app/home → /app/scanner → (AI Scan) → /app/recipes → /app/recipe/:id
```

### **4. Cooking Flow**
```
/app/recipe/:id → /app/recipes/:id/cook → (Complete) → /app/health
```

### **5. Shopping List Flow**
```
/app/recipe/:id → "Add to Shopping List" → /app/shopping-list
```

---

## Bottom Navigation Structure

### Active Routes (Always Available in `/app/*`)

| Icon | Label   | Path          | Component           |
|------|---------|---------------|---------------------|
| 🏠   | Home    | /app/home     | HomePage            |
| 🔍   | Search  | /app/search   | SearchPage          |
| 👨‍🍳   | Recipes | /app/recipes  | RecipesPage         |
| 📊   | Health  | /app/health   | HealthPage          |
| 👤   | Profile | /app/profile  | ProfilePage         |

### Overlay Routes (Full Screen, No Bottom Nav)
- `/app/scanner` - Camera scanner (full screen)
- `/app/recipe/:id` - Recipe detail (scrollable)
- `/app/recipes/:id/cook` - Cooking mode (full screen, minimal UI)
- `/app/shopping-list` - Shopping list manager

---

## State Management

### **LocalStorage Keys**
```javascript
// Onboarding Status
localStorage.setItem('kwil_onboarding_complete', 'true')

// Suggested Keys for Future Implementation
localStorage.setItem('kwil_user_preferences', JSON.stringify({
  diets: ['vegan', 'high-protein'],
  cuisines: ['indian', 'italian'],
  goals: ['low-carb'],
  budget: 200
}))

localStorage.setItem('kwil_saved_recipes', JSON.stringify([1, 3, 5]))
localStorage.setItem('kwil_shopping_list', JSON.stringify([...]))
```

---

## Route Parameters

### **Dynamic Routes**
```typescript
// Recipe Detail
/app/recipe/:id
/app/recipes/:id  // Alias for compatibility

// Cooking Mode
/app/recipes/:id/cook

// Example Usage
/app/recipe/1 → RecipeDetailPage (id = "1")
/app/recipes/2/cook → CookingModePage (id = "2")
```

---

## Navigation Guards

### **Authentication Check**
All `/app/*` routes should verify user is authenticated:
```typescript
// Pseudo-code
if (!localStorage.getItem('kwil_auth_token')) {
  navigate('/auth')
}
```

### **Onboarding Check**
Root `/` checks onboarding status:
```typescript
if (localStorage.getItem('kwil_onboarding_complete')) {
  navigate('/app/home')
} else {
  navigate('/onboarding')
}
```

---

## Back Button Behavior

### **Standard Back Navigation**
```
Current Page          → Back Button Action
────────────────────────────────────────────
/app/scanner          → /app/home (or previous)
/app/recipe/:id       → /app/recipes
/app/recipes/:id/cook → /app/recipe/:id
/app/shopping-list    → /app/recipe/:id (or previous)
/preferences          → /auth
```

### **Bottom Nav Override**
When user taps bottom nav icon, it **always** navigates to that route (no history stack).

---

## Deep Linking Structure

### **URL Patterns for External Sharing**
```
kwilai://recipe/123           → /app/recipe/123
kwilai://scan                 → /app/scanner
kwilai://cooking/456          → /app/recipes/456/cook
kwilai://health               → /app/health
kwilai://profile              → /app/profile
```

---

## Error Routes

### **404 Not Found**
```
/* (wildcard) → Navigate to="/" replace
```

Any undefined route redirects to splash screen.

---

## Navigation Transitions

### **Animation Types**
| From → To                  | Transition           |
|----------------------------|----------------------|
| Splash → Onboarding        | Fade (500ms)         |
| Onboarding → Auth          | Slide Left (300ms)   |
| Auth → Preferences         | Slide Left (300ms)   |
| Preferences → Home         | Fade Up (400ms)      |
| Home → Scanner             | Scale Up (350ms)     |
| Scanner → Recipes          | Slide Left (300ms)   |
| Recipe → Cooking           | Fade (250ms)         |
| Bottom Nav Changes         | Instant (0ms)        |

---

## Conditional Navigation

### **Scan Button Behavior**
```
Location: Home Dashboard (Floating Action Button)
Action: Click
Destination: /app/scanner

Location: Bottom Nav (Optional)
Action: Click
Destination: /app/scanner
```

### **Shopping List Access**
```
Entry Points:
1. Recipe Detail → "Add to List" button → /app/shopping-list
2. Profile → Settings → Shopping List → /app/shopping-list
```

---

## Navigation State

### **Preserve Scroll Position**
```
Pages that should remember scroll:
- /app/recipes
- /app/health
- /app/profile
- /app/shopping-list
```

### **Reset Scroll Position**
```
Pages that should scroll to top:
- /app/recipe/:id (new recipe)
- /app/scanner (new scan)
- /app/home (from bottom nav)
```

---

## Quick Access Shortcuts

### **From Home Dashboard**
```
┌─────────────────────────────────────┐
│  Quick Action Chips:                │
│  • Protein  → /app/recipes?filter=protein
│  • Diet     → /app/recipes?filter=diet
│  • Budget   → /app/recipes?filter=budget
│  • Quick    → /app/recipes?filter=quick
│  • Healthy  → /app/recipes?filter=healthy
└─────────────────────────────────────┘
```

### **From Recipe Detail**
```
┌─────────────────────────────────────┐
│  Action Buttons:                    │
│  • Start Cooking → /app/recipes/:id/cook
│  • Add to List   → /app/shopping-list
│  • Share         → (Native Share API)
│  • Save          → (Toggle favorite state)
└─────────────────────────────────────┘
```

---

## Navigation Context

### **Breadcrumb Examples**
```
Home > Recipes > Paneer Tikka
Home > Scanner > Scan Results > Recipes > Vegetable Curry
Home > Profile > Edit Preferences
```

### **History Stack Management**
```
Action                     | Stack
────────────────────────────────────────
Open app                   | [/]
Navigate to onboarding     | [/, /onboarding]
Navigate to auth           | [/, /onboarding, /auth]
Navigate to preferences    | [/, /onboarding, /auth, /preferences]
Navigate to home           | [/app/home]  ← Stack reset
Tap Scanner               | [/app/home, /app/scanner]
Tap Find Recipes          | [/app/home, /app/scanner, /app/recipes]
```

---

## Developer Notes

### **React Router Implementation**
```typescript
import { useNavigate } from 'react-router';

const navigate = useNavigate();

// Navigate to route
navigate('/app/recipes');

// Navigate with state
navigate('/app/recipe/123', { state: { from: 'scanner' } });

// Go back
navigate(-1);

// Replace (no history)
navigate('/app/home', { replace: true });
```

### **Link Components**
```typescript
import { Link } from 'react-router';

<Link to="/app/recipe/1">View Recipe</Link>
```

---

**Version:** 1.0.0
**Last Updated:** February 15, 2026
**Framework:** React Router v7
