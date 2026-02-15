# Kwil AI - Complete UI Flow Documentation

## Design System Overview

**Brand Identity:**
- **Primary Color:** #00FF9C (Neon Green)
- **Background:** #050B08 (Deep Dark Green)
- **Typography:** Inter / SF Pro
- **Grid System:** 8pt grid
- **Button Radius:** 14px (capsule-shaped)
- **Mobile Frame:** 390x844 (iPhone 14 Pro)

**Design Principles:**
- Glassmorphism effects with backdrop blur
- Neon green accents with glow shadows
- Floating cards with soft gradients
- Holographic interface elements
- AI-powered premium aesthetic
- Student-friendly, health-focused design

---

## Complete User Flow

### **1. Splash Screen** → `/`
- **Duration:** 3 seconds auto-redirect
- **Components:** KwilSplash
- **Features:**
  - Animated Kwil AI logo with pulsing effect
  - Neon green glow shadows
  - Background gradient animation
  - Floating particles
- **Navigation:**
  - New users → `/onboarding`
  - Returning users → `/app/home`
  - Logic: Checks `localStorage.getItem('kwil_onboarding_complete')`

---

### **2. Onboarding** → `/onboarding`
- **Components:** KwilOnboarding
- **Screens:** 3 carousel screens
  1. **Scan Your Food** - Camera ingredient detection
  2. **AI Smart Recipes** - Personalized meal recommendations
  3. **Cook Like a Pro** - Voice-guided cooking
- **Features:**
  - Horizontal swipe navigation
  - Progress indicators (dots)
  - Skip button
  - Glassmorphic cards
- **Navigation:**
  - "Get Started" button → `/auth`

---

### **3. Login/Authentication** → `/auth`
- **Components:** KwilAuth
- **Features:**
  - Email/Password input with KwilInput component
  - Social login options:
    - Google OAuth (with branded SVG icon)
    - Phone authentication
  - "Forgot password" link
  - "Register now" link
  - Floating glass card design
  - AI sparkle animations
- **Navigation:**
  - "Login" button → `/preferences`

---

### **4. Setup/Preferences** → `/preferences`
- **Components:** KwilPreferences
- **Sections:**
  1. **Diet Type:** Weight Loss, Muscle Gain, Vegan, Keto, Jain, Student Diet
  2. **Cuisine Preferences:** Indian, Chinese, Italian, South Indian
  3. **Nutritional Goals:** High Protein, Low Carb, Low Fat
  4. **Budget Range:** ₹50 - ₹500 slider with quick select buttons
- **Features:**
  - Multi-select chips with checkmarks
  - Progress bar tracking (4 sections)
  - Real-time summary card
  - Budget slider with visual feedback
  - Disabled "Continue" until all sections complete
- **Navigation:**
  - "Continue" button (when 100% complete) → `/dashboard` (redirects to `/app/home`)
  - Sets `localStorage.setItem('kwil_onboarding_complete', 'true')`

---

### **5. Home/Dashboard** → `/app/home`
- **Components:** KwilDashboard
- **Layout:** AppLayout with bottom navigation
- **Features:**
  - **Header:**
    - Personalized greeting
    - Notification bell with badge
    - User avatar
  - **Quick Actions:** Protein, Diet, Budget, Quick, Healthy filters
  - **Stats Cards:**
    - Today's calories
    - Meals logged
    - Active streak
  - **AI Recommendations:**
    - Recipe cards with emoji icons
    - Cook time, calories, difficulty
    - Category tags
  - **Scan Button:** Prominent FAB for camera access
- **Navigation:**
  - Scan button → `/app/scanner`
  - Recipe cards → `/app/recipe/:id`
  - Bottom nav:
    - Home (active)
    - Search → `/app/search`
    - Recipes → `/app/recipes`
    - Health → `/app/health`
    - Profile → `/app/profile`

---

### **6. Scan/Camera** → `/app/scanner`
- **Components:** KwilScanner
- **Features:**
  - **Live Camera View:**
    - AI HUD with corner brackets
    - Scanning frame with grid overlay
    - Animated scan lines
    - Real-time detection markers
  - **Detection Panel:**
    - 3-second scanning animation
    - Detected ingredients list with:
      - Item emoji/icon
      - Name and category
      - Confidence percentage (color-coded)
      - Progress bars
  - **Controls:**
    - Flash toggle
    - Gallery access
    - Rescan button
    - Edit detected items
- **Navigation:**
  - "Find Recipes" button → `/app/recipes`
  - Close button → back to previous page

---

### **7. Results/Recipes** → `/app/recipes`
- **Components:** KwilRecipes
- **Features:**
  - **Filter Tabs:**
    - All Recipes
    - High Protein
    - Low Carb
    - Quick Meals
    - Budget-Friendly
  - **Recipe Grid:**
    - Card layout with images
    - Cook time, calories, servings
    - Difficulty badges
    - Favorite/save icons
    - AI-recommended badges
  - **Search & Filter:**
    - Search bar with AI suggestions
    - Filter by dietary preferences
    - Sort by popularity, time, calories
- **Navigation:**
  - Recipe card click → `/app/recipe/:id`

---

### **8. Recipe Detail** → `/app/recipe/:id`
- **Components:** KwilRecipeDetail
- **Features:**
  - **Header:**
    - Recipe hero image/emoji
    - Recipe name and description
    - Rating and reviews
  - **Info Cards:**
    - Nutrition facts (calories, protein, carbs, fats)
    - Cook time, servings, difficulty
    - Dietary tags (vegan, keto, etc.)
  - **Ingredients List:**
    - Checkable items
    - Quantities and measurements
    - "Add to Shopping List" button
  - **Instructions:**
    - Step-by-step numbered list
    - Timer indicators
    - Tips and notes
  - **Action Buttons:**
    - Save/Favorite
    - Share recipe
    - Start Cooking (primary)
- **Navigation:**
  - "Start Cooking" → `/app/recipes/:id/cook`
  - "Add to Shopping List" → `/app/shopping-list`
  - Back button → previous page

---

### **9. Cooking Mode** → `/app/recipes/:id/cook`
- **Components:** KwilCookingMode
- **Features:**
  - **Hands-Free Interface:**
    - Large text for readability
    - Voice commands enabled
    - Auto-progression option
  - **Step Cards:**
    - Current step highlighted
    - Previous/next navigation
    - Timer integration
    - Progress bar
  - **Voice Controls:**
    - "Next step"
    - "Repeat step"
    - "Start timer"
  - **Timer Panel:**
    - Multiple timers support
    - Visual and audio alerts
    - Pause/resume controls
  - **Fullscreen Mode:**
    - Minimal distractions
    - Large buttons for dirty hands
- **Navigation:**
  - "Finish Cooking" → success screen → `/app/health`
  - Exit button → `/app/recipe/:id`

---

### **10. Analytics/Health Dashboard** → `/app/health`
- **Components:** KwilHealthDashboard
- **Features:**
  - **Metrics Overview:**
    - Daily calories consumed
    - Macros breakdown (protein, carbs, fats)
    - Water intake tracker
    - Weight progress
  - **Charts:**
    - Weekly calorie trends (line chart)
    - Macro distribution (donut chart)
    - Meal frequency (bar chart)
  - **Goals Tracking:**
    - Daily/weekly targets
    - Progress rings
    - Achievement badges
  - **Insights:**
    - AI-powered recommendations
    - Nutritional tips
    - Meal suggestions based on goals
- **Navigation:**
  - Meal log entries → `/app/recipe/:id`
  - Bottom navigation active

---

### **11. Profile/Settings** → `/app/profile`
- **Components:** ProfilePage
- **Features:**
  - **User Info Card:**
    - Avatar with edit option
    - Name and email
    - Premium badge (if applicable)
  - **Stats Row:**
    - Recipes saved
    - Meals cooked
    - Day streak
  - **Settings Sections:**
    - **Account:** Edit profile, dietary preferences, subscription
    - **Preferences:** Notifications, measurement units, language
    - **Support:** Help center, privacy & security, terms
  - **Action Items:**
    - Sign out button
    - Delete account
- **Navigation:**
  - "Edit Preferences" → `/preferences`
  - "Help Center" → external link
  - Sign out → `/` (clear localStorage)

---

### **12. Shopping List** (NEW) → `/app/shopping-list`
- **Components:** KwilShoppingList
- **Features:**
  - **Header:**
    - Item count and collected count
    - Progress bar
    - Share and download buttons
  - **Add Item:**
    - Quick add input with auto-complete
    - Manual entry
  - **AI Suggestions:**
    - Based on saved recipes
    - Common pantry items
  - **Grouped Lists:**
    - Categories: Dairy, Vegetables, Spices, Grains
    - Collapsible sections
  - **Item Cards:**
    - Checkbox to mark collected
    - Quantity display
    - Source recipe tag
    - Delete option
    - Strike-through when checked
  - **Actions:**
    - "Start Shopping" mode
    - Clear all checks
    - Export list
- **Navigation:**
  - Back button → previous page
  - Recipe tags → `/app/recipe/:id`

---

## Navigation Architecture

### **Bottom Navigation (AppLayout)**
Available on all `/app/*` routes:
1. **Home** - `/app/home` (house icon)
2. **Search** - `/app/search` (magnifying glass icon)
3. **Recipes** - `/app/recipes` (chef hat icon)
4. **Health** - `/app/health` (activity icon)
5. **Profile** - `/app/profile` (user icon)

### **Route Aliases**
- `/dashboard` → `/app/home` (for compatibility)

### **Protected Routes**
All `/app/*` routes check for authentication.
If not authenticated, redirect to `/auth`.

---

## Component Library

### **Core Components**
1. **KwilButton** - Primary/Secondary/Ghost variants
2. **KwilCard** - Glassmorphic cards with optional glow
3. **KwilInput** - Text/Email/Password inputs with icons
4. **KwilChip** - Selectable filter chips
5. **KwilProgress** - Animated progress bars
6. **KwilSwitch** - Toggle switches
7. **KwilAvatar** - User avatars with status indicators
8. **KwilBadge** - Notification/status badges
9. **KwilNavBar** - Bottom navigation component

### **Page Components**
1. **KwilSplash** - Animated splash screen
2. **KwilOnboarding** - Multi-screen onboarding carousel
3. **KwilAuth** - Authentication form
4. **KwilPreferences** - User preference setup
5. **KwilDashboard** - Home dashboard
6. **KwilScanner** - AI camera scanner
7. **KwilRecipes** - Recipe listing with filters
8. **KwilRecipeDetail** - Full recipe view
9. **KwilCookingMode** - Hands-free cooking interface
10. **KwilHealthDashboard** - Analytics and health tracking
11. **KwilShoppingList** - Shopping list manager
12. **ProfilePage** - User profile and settings

---

## Design Tokens

### **Spacing (8pt Grid)**
- **xs:** 4px
- **sm:** 8px
- **md:** 16px
- **lg:** 24px
- **xl:** 32px
- **2xl:** 48px
- **3xl:** 64px

### **Colors**
```css
--kwil-primary: #00FF9C;
--kwil-background: #050B08;
--kwil-surface: rgba(255, 255, 255, 0.05);
--kwil-border: rgba(255, 255, 255, 0.1);
--kwil-text-primary: #FFFFFF;
--kwil-text-secondary: #A0A0A0;
--kwil-accent-red: #FF6B6B;
--kwil-accent-yellow: #FFD93D;
--kwil-accent-pink: #FF9CEE;
--kwil-accent-green: #6BCF7F;
```

### **Shadows**
- **Glow Primary:** `0 0 20px rgba(0, 255, 156, 0.4)`
- **Glow Strong:** `0 0 40px rgba(0, 255, 156, 0.6)`
- **Card Elevated:** `0 10px 40px rgba(0, 0, 0, 0.3)`

### **Border Radius**
- **Button:** 14px (capsule)
- **Card:** 16px - 24px
- **Input:** 12px
- **Badge:** 999px (full circle)

### **Typography**
- **Heading 1:** 32px / Bold
- **Heading 2:** 24px / Bold
- **Heading 3:** 20px / Semibold
- **Body:** 16px / Regular
- **Caption:** 14px / Regular
- **Small:** 12px / Regular

---

## Animations

### **Motion Principles**
- **Ease-in-out** for smooth transitions
- **Spring animations** for interactive elements
- **Glow pulsing** for AI features
- **Fade + Slide** for page transitions

### **Durations**
- **Quick:** 150ms
- **Normal:** 300ms
- **Slow:** 500ms
- **AI Processing:** 2s loop

---

## Developer Handoff Checklist

### **Implemented Features** ✅
- [x] Complete routing system (React Router)
- [x] 12 fully designed screens
- [x] Responsive mobile layout (390x844)
- [x] Design system components (11 reusable)
- [x] Glassmorphism styling
- [x] Animation library integration (Motion)
- [x] Icon system (Lucide React)
- [x] LocalStorage for persistence
- [x] Navigation flow connectivity

### **Ready for Backend Integration** 🔌
- [ ] Authentication API endpoints
- [ ] Recipe database connection
- [ ] AI ingredient detection API
- [ ] User preferences storage
- [ ] Shopping list sync
- [ ] Nutrition calculation API
- [ ] Recipe recommendation engine

### **Future Enhancements** 🚀
- [ ] Voice command integration
- [ ] Real camera API integration
- [ ] Push notifications
- [ ] Social sharing functionality
- [ ] Recipe rating/reviews system
- [ ] Meal planning calendar
- [ ] Premium subscription features
- [ ] Multi-language support

---

## File Structure
```
/src/app/
├── App.tsx                    # Main app entry
├── routes.tsx                 # Route configuration
├── layouts/
│   └── AppLayout.tsx          # Bottom nav layout
├── pages/
│   ├── SplashPage.tsx         # 1. Splash
│   ├── OnboardingPage.tsx     # 2. Onboarding
│   ├── AuthPage.tsx           # 3. Login
│   ├── PreferencesPage.tsx    # 4. Setup
│   ├── HomePage.tsx           # 5. Home
│   ├── ScannerPage.tsx        # 6. Scan
│   ├── RecipesPage.tsx        # 7. Results
│   ├── RecipeDetailPage.tsx   # 8. Recipe
│   ├── CookingModePage.tsx    # 9. Cooking
│   ├── HealthPage.tsx         # 10. Analytics
│   ├── ProfilePage.tsx        # 11. Profile
│   └── ShoppingListPage.tsx   # 12. Shopping List
└── components/kwil/
    ├── KwilButton.tsx         # Button component
    ├── KwilCard.tsx           # Card component
    ├── KwilInput.tsx          # Input component
    ├── KwilChip.tsx           # Chip component
    ├── KwilProgress.tsx       # Progress bar
    ├── KwilSwitch.tsx         # Toggle switch
    ├── KwilAvatar.tsx         # Avatar component
    ├── KwilBadge.tsx          # Badge component
    ├── KwilNavBar.tsx         # Navigation bar
    ├── KwilSplash.tsx         # Splash screen
    ├── KwilOnboarding.tsx     # Onboarding flow
    ├── KwilAuth.tsx           # Auth form
    ├── KwilPreferences.tsx    # Preferences setup
    ├── KwilDashboard.tsx      # Dashboard
    ├── KwilScanner.tsx        # Camera scanner
    ├── KwilRecipes.tsx        # Recipe list
    ├── KwilRecipeDetail.tsx   # Recipe detail
    ├── KwilCookingMode.tsx    # Cooking mode
    ├── KwilHealthDashboard.tsx # Health dashboard
    └── KwilShoppingList.tsx   # Shopping list
```

---

## Notes for Developers

1. **All navigation is functional** - Every button and link navigates to the correct screen
2. **LocalStorage is used** for onboarding completion flag
3. **Motion/Framer Motion** powers all animations
4. **Lucide React** provides all icons
5. **Tailwind CSS v4** with custom theme tokens
6. **8pt grid system** enforced throughout
7. **Mobile-first** design (390x844 frame)
8. **Glassmorphism** achieved via backdrop-filter and rgba backgrounds
9. **Neon effects** using box-shadow and glow animations
10. **Component variants** supported (primary/secondary/ghost for buttons)

---

## Testing Checklist

### **Flow Testing**
- [ ] Splash → Onboarding → Auth → Preferences → Home (first-time user)
- [ ] Splash → Home (returning user)
- [ ] Home → Scanner → Recipes → Recipe Detail → Cooking Mode → Health
- [ ] Profile → Edit Preferences → Back to Profile
- [ ] Recipe Detail → Shopping List → Back
- [ ] All bottom navigation links work
- [ ] Back buttons navigate correctly

### **Component Testing**
- [ ] Buttons respond to hover/tap
- [ ] Inputs accept text and show validation
- [ ] Cards render with proper glassmorphism
- [ ] Animations play smoothly
- [ ] Progress bars update correctly
- [ ] Switches toggle state
- [ ] Chips are selectable
- [ ] Avatars display correctly

---

**Version:** 1.0.0
**Last Updated:** February 15, 2026
**Design System:** Kwil AI Mobile App
**Framework:** React + Tailwind CSS v4 + Motion
