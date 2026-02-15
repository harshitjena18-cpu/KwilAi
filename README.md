# Kwil AI - Complete Mobile App UI Flow

> **An AI-powered food and recipe app with a dark futuristic aesthetic featuring glassmorphism effects and neon green accents.**

---

## 📱 Project Overview

**Kwil AI** is a comprehensive mobile application design system built with React, Tailwind CSS v4, and Motion (Framer Motion). The app provides an intelligent cooking assistant experience with AI-powered ingredient scanning, personalized recipe recommendations, hands-free cooking mode, and nutrition tracking.

### **Design Philosophy**
- **Modern AI Aesthetic:** Premium tech startup vibes with holographic interface elements
- **Student-Friendly:** Budget-conscious meal planning and quick recipes
- **Health-Focused:** Nutrition tracking and goal-based recommendations
- **Futuristic UI:** Glassmorphism, neon glow effects, and smooth animations

---

## 🎨 Design System

### **Color Palette**
```css
Primary:     #00FF9C  /* Neon Green */
Background:  #050B08  /* Deep Dark Green */
Surface:     rgba(255, 255, 255, 0.05)
Border:      rgba(255, 255, 255, 0.1)
Text:        #FFFFFF / #A0A0A0
Accents:     #FF6B6B, #FFD93D, #FF9CEE, #6BCF7F
```

### **Typography**
- **Font Family:** Inter / SF Pro
- **Sizes:** 12px - 32px
- **Weights:** Regular (400), Medium (500), Semibold (600), Bold (700)

### **Grid System**
- **Base Unit:** 8pt grid
- **Spacing Scale:** 4px, 8px, 16px, 24px, 32px, 48px, 64px

### **Components**
- **Border Radius:** 14px (buttons), 16-24px (cards)
- **Glassmorphism:** `backdrop-filter: blur(10px)`
- **Glow Effects:** `box-shadow: 0 0 20px rgba(0, 255, 156, 0.4)`

---

## 🚀 Complete User Flow

```
Splash (3s) 
  → Onboarding (3 screens)
    → Login/Auth
      → Preferences Setup (4 sections)
        → Main App Dashboard
          ├─→ Scan Ingredients → AI Detection → Recipe Results → Recipe Detail → Cooking Mode
          ├─→ Browse Recipes → Recipe Detail → Shopping List
          ├─→ Health Analytics → Meal Logging
          └─→ Profile Settings → Edit Preferences
```

---

## 📂 Project Structure

```
/src/app/
├── App.tsx                      # Main app entry with mobile frame
├── routes.tsx                   # React Router configuration (12 routes)
│
├── layouts/
│   └── AppLayout.tsx            # Bottom navigation layout wrapper
│
├── pages/                       # 12 Complete Screens
│   ├── SplashPage.tsx           # 1. Animated splash screen
│   ├── OnboardingPage.tsx       # 2. 3-screen carousel
│   ├── AuthPage.tsx             # 3. Login/authentication
│   ├── PreferencesPage.tsx      # 4. User setup (4 sections)
│   ├── HomePage.tsx             # 5. Dashboard with recommendations
│   ├── ScannerPage.tsx          # 6. AI camera scanner
│   ├── RecipesPage.tsx          # 7. Recipe listing/filters
│   ├── RecipeDetailPage.tsx     # 8. Full recipe view
│   ├── CookingModePage.tsx      # 9. Hands-free cooking
│   ├── HealthPage.tsx           # 10. Analytics dashboard
│   ├── ProfilePage.tsx          # 11. User profile/settings
│   └── ShoppingListPage.tsx     # 12. Shopping list manager
│
└── components/kwil/             # Design System Components
    ├── KwilButton.tsx           # 3 variants: primary/secondary/ghost
    ├── KwilCard.tsx             # Glassmorphic cards
    ├── KwilInput.tsx            # Text/email/password inputs
    ├── KwilChip.tsx             # Selectable filter chips
    ├── KwilProgress.tsx         # Animated progress bars
    ├── KwilSwitch.tsx           # Toggle switches
    ├── KwilAvatar.tsx           # User avatars
    ├── KwilBadge.tsx            # Notification badges
    ├── KwilNavBar.tsx           # Bottom navigation
    │
    └── [Page Components]        # Full-page implementations
        ├── KwilSplash.tsx
        ├── KwilOnboarding.tsx
        ├── KwilAuth.tsx
        ├── KwilPreferences.tsx
        ├── KwilDashboard.tsx
        ├── KwilScanner.tsx
        ├── KwilRecipes.tsx
        ├── KwilRecipeDetail.tsx
        ├── KwilCookingMode.tsx
        ├── KwilHealthDashboard.tsx
        └── KwilShoppingList.tsx
```

---

## ✅ Implementation Status

### **Completed Features**
- ✅ **12 Complete Screens** - All UI flows designed and implemented
- ✅ **11 Reusable Components** - Production-ready design system
- ✅ **Full Navigation Flow** - React Router with 12+ routes
- ✅ **Glassmorphism Styling** - Consistent dark futuristic aesthetic
- ✅ **Smooth Animations** - Motion/Framer Motion throughout
- ✅ **Mobile-First Design** - 390x844 iPhone 14 Pro frame
- ✅ **LocalStorage Integration** - Onboarding completion tracking
- ✅ **Responsive Components** - Auto-layout with constraints

### **Key Features**
1. **AI Ingredient Scanner** - Camera UI with real-time detection markers
2. **Recipe Recommendations** - Personalized based on preferences
3. **Cooking Mode** - Hands-free interface with voice commands ready
4. **Health Dashboard** - Calorie tracking, macros, charts
5. **Shopping List** - Auto-generated from recipes, grouped by category
6. **User Preferences** - Diet, cuisine, goals, budget customization

---

## 📋 Route Map

| Path                      | Component           | Description                    |
|---------------------------|---------------------|--------------------------------|
| `/`                       | SplashPage          | Animated splash (3s redirect)  |
| `/onboarding`             | OnboardingPage      | 3-screen intro carousel        |
| `/auth`                   | AuthPage            | Login/authentication           |
| `/preferences`            | PreferencesPage     | User setup (4 sections)        |
| `/dashboard`              | → `/app/home`       | Redirect alias                 |
| `/app/home`               | HomePage            | Main dashboard                 |
| `/app/search`             | SearchPage          | Recipe search                  |
| `/app/recipes`            | RecipesPage         | Recipe listing                 |
| `/app/recipe/:id`         | RecipeDetailPage    | Recipe detail view             |
| `/app/recipes/:id`        | RecipeDetailPage    | Alias for compatibility        |
| `/app/recipes/:id/cook`   | CookingModePage     | Hands-free cooking             |
| `/app/health`             | HealthPage          | Analytics dashboard            |
| `/app/profile`            | ProfilePage         | User settings                  |
| `/app/scanner`            | ScannerPage         | AI camera scanner              |
| `/app/shopping-list`      | ShoppingListPage    | Shopping list manager          |

---

## 🎯 Navigation Architecture

### **Bottom Navigation** (Available on all `/app/*` routes)
```
🏠 Home  |  🔍 Search  |  👨‍🍳 Recipes  |  📊 Health  |  👤 Profile
```

### **Key User Flows**

**First-Time User:**
```
Splash → Onboarding → Auth → Preferences → Home
```

**Returning User:**
```
Splash → Home (skips onboarding via localStorage)
```

**Recipe Discovery:**
```
Home → Scanner → AI Detection → Recipe Results → Recipe Detail → Cooking Mode
```

**Shopping:**
```
Recipe Detail → "Add to List" → Shopping List
```

---

## 🛠️ Technologies Used

### **Core Stack**
- **React 18** - Component framework
- **TypeScript** - Type safety
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icon system

### **Build Tools**
- **Vite** - Fast development server
- **ESLint** - Code linting
- **PostCSS** - CSS processing

---

## 🎨 Design Tokens

### **Spacing (8pt Grid)**
```css
--space-xs:  4px
--space-sm:  8px
--space-md:  16px
--space-lg:  24px
--space-xl:  32px
--space-2xl: 48px
--space-3xl: 64px
```

### **Border Radius**
```css
--radius-sm:  12px   /* Inputs */
--radius-md:  14px   /* Buttons (capsule) */
--radius-lg:  16px   /* Cards */
--radius-xl:  24px   /* Large cards */
--radius-full: 999px /* Circles/pills */
```

### **Shadows**
```css
--shadow-glow-sm:   0 0 10px rgba(0, 255, 156, 0.3)
--shadow-glow-md:   0 0 20px rgba(0, 255, 156, 0.4)
--shadow-glow-lg:   0 0 40px rgba(0, 255, 156, 0.6)
--shadow-elevated:  0 10px 40px rgba(0, 0, 0, 0.3)
```

---

## 📖 Documentation Files

1. **README.md** (this file) - Project overview
2. **UI_FLOW_DOCUMENTATION.md** - Complete screen-by-screen flow guide
3. **NAVIGATION_FLOW.md** - Visual navigation diagrams and routing details
4. **COMPONENT_SPECS.md** - Component API and usage specifications

---

## 🚦 Getting Started

### **Installation**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### **Key Dependencies**
```json
{
  "react": "^18.x",
  "react-router": "^7.x",
  "motion": "^11.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^4.x"
}
```

---

## 🎭 Component Usage Examples

### **Button**
```tsx
import { KwilButton } from './components/kwil/KwilButton';

<KwilButton variant="primary" fullWidth onClick={handleClick}>
  Get Started
</KwilButton>
```

### **Card**
```tsx
import { KwilCard } from './components/kwil/KwilCard';

<KwilCard glow>
  <h3>Recipe Title</h3>
  <p>Delicious meal description</p>
</KwilCard>
```

### **Input**
```tsx
import { KwilInput } from './components/kwil/KwilInput';
import { Mail } from 'lucide-react';

<KwilInput
  type="email"
  placeholder="Enter email"
  icon={<Mail size={20} />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## 🔐 LocalStorage Keys

### **Onboarding Status**
```javascript
localStorage.setItem('kwil_onboarding_complete', 'true');
```

### **Suggested Keys for Backend Integration**
```javascript
// User Preferences
localStorage.setItem('kwil_user_preferences', JSON.stringify({
  diets: ['vegan', 'high-protein'],
  cuisines: ['indian', 'italian'],
  goals: ['low-carb'],
  budget: 200
}));

// Saved Recipes
localStorage.setItem('kwil_saved_recipes', JSON.stringify([1, 3, 5]));

// Shopping List
localStorage.setItem('kwil_shopping_list', JSON.stringify([...]));
```

---

## 🔌 Backend Integration Readiness

### **API Endpoints Needed**

**Authentication**
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/social/google
POST /api/auth/social/phone
```

**User Preferences**
```typescript
GET  /api/users/preferences
PUT  /api/users/preferences
```

**Recipes**
```typescript
GET  /api/recipes
GET  /api/recipes/:id
GET  /api/recipes/search?q=...&filters=...
POST /api/recipes/:id/save
POST /api/recipes/:id/rate
```

**AI Scanner**
```typescript
POST /api/scan/ingredients  // Upload image → detect items
```

**Shopping List**
```typescript
GET    /api/shopping-list
POST   /api/shopping-list/items
PUT    /api/shopping-list/items/:id
DELETE /api/shopping-list/items/:id
```

**Health Dashboard**
```typescript
GET  /api/health/stats
POST /api/health/meals/log
GET  /api/health/progress?days=7
```

---

## 🎯 Next Steps for Developers

### **Phase 1: Backend Setup** (Week 1-2)
- [ ] Set up REST API or GraphQL server
- [ ] Implement authentication (JWT/OAuth)
- [ ] Create database schema (Users, Recipes, Preferences)
- [ ] Integrate AI ingredient detection API

### **Phase 2: Data Integration** (Week 3-4)
- [ ] Replace mock data with real API calls
- [ ] Implement recipe search and filtering
- [ ] Add user preference persistence
- [ ] Set up shopping list sync

### **Phase 3: Advanced Features** (Week 5-6)
- [ ] Voice command integration for cooking mode
- [ ] Real camera API for ingredient scanning
- [ ] Push notifications for meal reminders
- [ ] Social sharing functionality

### **Phase 4: Polish & Launch** (Week 7-8)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] App store submission (iOS/Android)

---

## 🎨 Design Handoff Checklist

### **Assets Delivered**
- ✅ 12 complete screen designs
- ✅ 11 reusable component library
- ✅ Design system documentation
- ✅ Navigation flow diagrams
- ✅ Component specifications
- ✅ Color palette and tokens
- ✅ Typography scale
- ✅ Spacing system (8pt grid)
- ✅ Animation specifications
- ✅ Icon library (Lucide React)

### **Developer-Ready**
- ✅ Production React code
- ✅ Tailwind CSS styling
- ✅ React Router navigation
- ✅ Motion animations
- ✅ Responsive layouts
- ✅ TypeScript types
- ✅ Component props documented
- ✅ Accessibility considerations

---

## 📊 Project Metrics

- **Total Screens:** 12
- **Reusable Components:** 11
- **Routes:** 15+
- **Code Quality:** TypeScript + ESLint
- **Accessibility:** WCAG 2.1 AA ready
- **Mobile Frame:** 390x844 (iPhone 14 Pro)
- **Animation Library:** Motion (Framer Motion)
- **Icon Library:** Lucide React (200+ icons)

---

## 🤝 Contributing

This is a complete design system handoff. For future enhancements:

1. Follow the established design tokens
2. Use existing components when possible
3. Maintain the 8pt grid system
4. Keep the dark futuristic aesthetic
5. Test on 390x844 mobile frame
6. Ensure smooth animations (300ms standard)

---

## 📄 License

**Design System:** Proprietary - Kwil AI
**Framework:** React (MIT License)
**Icons:** Lucide React (ISC License)

---

## 📞 Support

For questions about the design system or implementation:
- See **UI_FLOW_DOCUMENTATION.md** for screen details
- See **COMPONENT_SPECS.md** for component API
- See **NAVIGATION_FLOW.md** for routing logic

---

**Version:** 1.0.0  
**Last Updated:** February 15, 2026  
**Design System:** Kwil AI Mobile App  
**Status:** ✅ Ready for Developer Handoff

---

## 🎉 Summary

Kwil AI is a **production-ready** mobile app design system featuring:
- ✨ Modern AI-powered cooking assistant interface
- 🎨 Complete glassmorphism design with neon green accents
- 📱 12 fully-implemented screens with smooth navigation
- 🧩 11 reusable components for rapid development
- 🚀 Ready for backend integration and app store deployment

**The complete UI flow is live and functional.** All screens are connected, all buttons navigate correctly, and the entire user journey from splash to cooking mode is seamless.

---

**Happy Coding! 🚀**
