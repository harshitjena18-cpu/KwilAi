# Kwil AI - Component Specifications

## Design System Components

### **1. KwilButton**
**Path:** `/src/app/components/kwil/KwilButton.tsx`

**Props:**
```typescript
interface KwilButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

**Variants:**
- **Primary:** Neon green gradient with glow effect
- **Secondary:** Transparent with green border
- **Ghost:** Minimal styling, transparent background

**Styling:**
```css
border-radius: 14px (capsule-shaped)
padding: 12px 24px
font-weight: 600
transition: all 300ms
```

**States:**
- Hover: `scale(1.02)` + increased glow
- Active: `scale(0.98)`
- Disabled: 50% opacity, no interaction

**Usage:**
```tsx
<KwilButton variant="primary" fullWidth onClick={handleClick}>
  Get Started
</KwilButton>
```

---

### **2. KwilCard**
**Path:** `/src/app/components/kwil/KwilCard.tsx`

**Props:**
```typescript
interface KwilCardProps {
  children: React.ReactNode;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}
```

**Features:**
- Glassmorphism effect (backdrop-filter: blur(10px))
- Optional glow border for emphasis
- Responsive padding (16px mobile, 24px desktop)
- Auto-adjusts to content height

**Styling:**
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 16px - 24px;
backdrop-filter: blur(10px);
```

**Glow Variant:**
```css
border: 1px solid rgba(0, 255, 156, 0.3);
box-shadow: 0 0 20px rgba(0, 255, 156, 0.2);
```

**Usage:**
```tsx
<KwilCard glow>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</KwilCard>
```

---

### **3. KwilInput**
**Path:** `/src/app/components/kwil/KwilInput.tsx`

**Props:**
```typescript
interface KwilInputProps {
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  className?: string;
}
```

**Features:**
- Left icon slot for lucide-react icons
- Error state with red border and message
- Focus state with neon glow
- Auto-complete friendly

**Styling:**
```css
background: rgba(255, 255, 255, 0.05);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
padding: 12px 16px;
color: white;
```

**Focus State:**
```css
border: 1px solid rgba(0, 255, 156, 0.5);
box-shadow: 0 0 15px rgba(0, 255, 156, 0.3);
```

**Error State:**
```css
border: 1px solid rgba(255, 59, 48, 0.5);
```

**Usage:**
```tsx
<KwilInput
  type="email"
  placeholder="Enter your email"
  icon={<Mail size={20} />}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

---

### **4. KwilChip**
**Path:** `/src/app/components/kwil/KwilChip.tsx`

**Props:**
```typescript
interface KwilChipProps {
  label: string;
  icon?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'filter' | 'tag';
}
```

**States:**
- **Unselected:** Gray background, muted text
- **Selected:** Green gradient background, neon border, checkmark icon

**Animations:**
- Tap: `scale(0.95)`
- Hover: `scale(1.05)`
- Selection: Checkmark appears with spring animation

**Styling:**
```css
border-radius: 999px (full pill shape);
padding: 8px 16px;
font-size: 14px;
transition: all 200ms;
```

**Selected State:**
```css
background: linear-gradient(135deg, rgba(0, 255, 156, 0.2), rgba(16, 185, 129, 0.2));
border: 1px solid rgba(0, 255, 156, 0.5);
box-shadow: 0 0 20px rgba(0, 255, 156, 0.4);
color: #00FF9C;
```

**Usage:**
```tsx
<KwilChip
  label="Vegan"
  icon={<Leaf size={16} />}
  selected={isSelected}
  onClick={toggleSelection}
/>
```

---

### **5. KwilProgress**
**Path:** `/src/app/components/kwil/KwilProgress.tsx`

**Props:**
```typescript
interface KwilProgressProps {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}
```

**Features:**
- Animated fill from left to right
- Gradient green fill bar
- Glow effect on active bar
- Smooth transitions (500ms ease-in-out)

**Sizes:**
- **sm:** height: 4px
- **md:** height: 8px
- **lg:** height: 12px

**Styling:**
```css
/* Container */
background: rgba(255, 255, 255, 0.1);
border-radius: 999px;
overflow: hidden;

/* Fill Bar */
background: linear-gradient(90deg, #00FF9C 0%, #10B981 100%);
box-shadow: 0 0 15px rgba(0, 255, 156, 0.6);
transition: width 500ms ease-in-out;
```

**Usage:**
```tsx
<KwilProgress 
  value={75} 
  showLabel 
  size="md" 
  animated 
/>
```

---

### **6. KwilSwitch**
**Path:** `/src/app/components/kwil/KwilSwitch.tsx`

**Props:**
```typescript
interface KwilSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}
```

**States:**
- **Off:** Gray track, white thumb
- **On:** Green gradient track, white thumb with glow

**Animations:**
- Thumb slides with spring physics
- Track color transitions smoothly
- Tap feedback with scale animation

**Dimensions:**
```css
width: 48px;
height: 28px;
thumb-size: 24px;
```

**On State:**
```css
background: linear-gradient(135deg, #00FF9C 0%, #10B981 100%);
box-shadow: 0 0 20px rgba(0, 255, 156, 0.5);
```

**Usage:**
```tsx
<KwilSwitch
  checked={notificationsEnabled}
  onChange={setNotificationsEnabled}
  label="Enable Notifications"
/>
```

---

### **7. KwilAvatar**
**Path:** `/src/app/components/kwil/KwilAvatar.tsx`

**Props:**
```typescript
interface KwilAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
  badge?: React.ReactNode;
}
```

**Sizes:**
- **sm:** 32px
- **md:** 48px
- **lg:** 64px
- **xl:** 96px

**Status Indicators:**
- Online: Green dot (8px)
- Offline: Gray dot
- Away: Yellow dot

**Features:**
- Gradient border on hover
- Badge slot for notifications/premium
- Fallback to initials if no image
- Circular clip-path

**Usage:**
```tsx
<KwilAvatar
  src="/user-photo.jpg"
  alt="User Name"
  size="lg"
  status="online"
  badge={<Crown size={16} />}
/>
```

---

### **8. KwilBadge**
**Path:** `/src/app/components/kwil/KwilBadge.tsx`

**Props:**
```typescript
interface KwilBadgeProps {
  count?: number;
  dot?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}
```

**Variants:**
- **Default:** Blue
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red

**Features:**
- Auto-hide if count = 0
- Show "99+" for counts > 99
- Pulse animation for new notifications
- Absolute positioning for overlay on parent

**Styling:**
```css
min-width: 20px;
height: 20px;
border-radius: 10px;
font-size: 11px;
font-weight: 700;
padding: 0 6px;
```

**Usage:**
```tsx
<div className="relative">
  <Bell size={24} />
  <KwilBadge count={3} variant="error" />
</div>
```

---

### **9. KwilNavBar**
**Path:** `/src/app/components/kwil/KwilNavBar.tsx`

**Props:**
```typescript
interface KwilNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

**Tabs:**
```typescript
[
  { id: 'home', label: 'Home', icon: Home, path: '/app/home' },
  { id: 'search', label: 'Search', icon: Search, path: '/app/search' },
  { id: 'recipes', label: 'Recipes', icon: ChefHat, path: '/app/recipes' },
  { id: 'health', label: 'Health', icon: Activity, path: '/app/health' },
  { id: 'profile', label: 'Profile', icon: User, path: '/app/profile' },
]
```

**Features:**
- Fixed position at bottom
- Glassmorphic background
- Active indicator (green glow)
- Icon + label layout
- Safe area padding for iOS

**Styling:**
```css
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 72px;
background: rgba(5, 11, 8, 0.95);
backdrop-filter: blur(20px);
border-top: 1px solid rgba(255, 255, 255, 0.1);
z-index: 1000;
```

**Active Tab:**
```css
color: #00FF9C;
text-shadow: 0 0 10px rgba(0, 255, 156, 0.5);
```

**Usage:**
```tsx
<KwilNavBar 
  activeTab="home" 
  onTabChange={(tab) => navigate(tab.path)} 
/>
```

---

## Page Components

### **10. KwilSplash**
**Path:** `/src/app/components/kwil/KwilSplash.tsx`

**Features:**
- Animated logo (scale + opacity)
- Pulsing glow effect
- Particle background
- Auto-redirect after 3s

**Animations:**
- Logo fade-in: 800ms
- Glow pulse: 2s loop
- Particles float: 3-5s random

**Usage:**
```tsx
<KwilSplash />
```

---

### **11. KwilOnboarding**
**Path:** `/src/app/components/kwil/KwilOnboarding.tsx`

**Features:**
- 3 screens horizontal carousel
- Swipe gestures (mobile)
- Progress dots indicator
- Skip button
- Auto-layout illustrations

**Screens:**
1. Scan Your Food
2. AI Smart Recipes
3. Cook Like a Pro

**Usage:**
```tsx
<KwilOnboarding />
```

---

### **12. KwilAuth**
**Path:** `/src/app/components/kwil/KwilAuth.tsx`

**Features:**
- Email/password inputs
- Social login buttons (Google, Phone)
- Forgot password link
- Register link
- Form validation

**Usage:**
```tsx
<KwilAuth />
```

---

### **13. KwilPreferences**
**Path:** `/src/app/components/kwil/KwilPreferences.tsx`

**Features:**
- 4 sections: Diet, Cuisine, Goals, Budget
- Multi-select chips
- Budget slider
- Progress tracking
- Summary card
- Validation (all sections required)

**Usage:**
```tsx
<KwilPreferences />
```

---

### **14. KwilDashboard**
**Path:** `/src/app/components/kwil/KwilDashboard.tsx`

**Features:**
- Personalized greeting
- Quick action filters
- Stats cards (calories, meals, streak)
- AI recipe recommendations
- Floating scan button

**Layout:**
```
┌─────────────────────────┐
│  Header (Greeting)      │
├─────────────────────────┤
│  Quick Actions (Chips)  │
├─────────────────────────┤
│  Stats Cards (Grid)     │
├─────────────────────────┤
│  Recommended Recipes    │
│  (Horizontal Scroll)    │
└─────────────────────────┘
```

**Usage:**
```tsx
<KwilDashboard />
```

---

### **15. KwilScanner**
**Path:** `/src/app/components/kwil/KwilScanner.tsx`

**Features:**
- AI HUD with corner brackets
- Scanning animation (3s)
- Real-time detection markers
- Confidence percentages
- Ingredient list
- Flash toggle
- Gallery access
- Edit/rescan options

**States:**
1. **Scanning:** Animated scan lines, rotating AI icon
2. **Detected:** Show detection boxes with confidence, list items

**Usage:**
```tsx
<KwilScanner />
```

---

### **16. KwilRecipes**
**Path:** `/src/app/components/kwil/KwilRecipes.tsx`

**Features:**
- Filter tabs
- Recipe grid cards
- Search functionality
- Sort options
- Favorite toggle
- AI-recommended badges

**Usage:**
```tsx
<KwilRecipes />
```

---

### **17. KwilRecipeDetail**
**Path:** `/src/app/components/kwil/KwilRecipeDetail.tsx`

**Features:**
- Hero image
- Nutrition facts
- Ingredient checklist
- Step-by-step instructions
- Save/share buttons
- Start cooking CTA

**Layout:**
```
┌─────────────────────────┐
│  Hero Image             │
├─────────────────────────┤
│  Title & Rating         │
├─────────────────────────┤
│  Info Cards (Grid)      │
├─────────────────────────┤
│  Ingredients (List)     │
├─────────────────────────┤
│  Instructions (Steps)   │
├─────────────────────────┤
│  Actions (Fixed Bottom) │
└─────────────────────────┘
```

**Usage:**
```tsx
<KwilRecipeDetail recipeId="1" />
```

---

### **18. KwilCookingMode**
**Path:** `/src/app/components/kwil/KwilCookingMode.tsx`

**Features:**
- Large readable text
- Voice commands
- Step navigation
- Timer integration
- Progress indicator
- Hands-free mode
- Fullscreen option

**Usage:**
```tsx
<KwilCookingMode recipeId="1" />
```

---

### **19. KwilHealthDashboard**
**Path:** `/src/app/components/kwil/KwilHealthDashboard.tsx`

**Features:**
- Calorie tracking
- Macro breakdown (charts)
- Water intake
- Weight progress
- Weekly trends
- Goal tracking
- Achievement badges

**Charts:**
- Line chart (Recharts): Weekly calories
- Donut chart: Macro distribution
- Bar chart: Meal frequency

**Usage:**
```tsx
<KwilHealthDashboard />
```

---

### **20. KwilShoppingList**
**Path:** `/src/app/components/kwil/KwilShoppingList.tsx`

**Features:**
- Add item input
- AI suggestions
- Grouped by category
- Checkable items
- Progress tracking
- Share/export options
- Recipe source tags

**Categories:**
- Dairy
- Vegetables
- Spices
- Grains
- Other

**Usage:**
```tsx
<KwilShoppingList />
```

---

## Shared Utilities

### **Animation Variants**
```typescript
// Fade In
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

// Slide Up
const slideUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4 }
}

// Scale Pop
const scalePop = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: 'spring', damping: 15 }
}
```

### **Color Utilities**
```typescript
const getGlowColor = (confidence: number) => {
  if (confidence >= 90) return '#00FF9C'; // High confidence
  if (confidence >= 80) return '#FFD93D'; // Medium
  return '#FF9CEE'; // Low
}
```

### **Responsive Helpers**
```typescript
const isMobile = () => window.innerWidth < 768;
const getCardPadding = () => isMobile() ? '16px' : '24px';
```

---

## Icon System

### **Lucide React Icons**
All icons from `lucide-react` library.

**Common Icons:**
```typescript
import {
  Home, Search, ChefHat, Activity, User,       // Navigation
  Camera, Sparkles, Zap, Check, X,             // Actions
  Heart, Share2, Bookmark, Clock, Flame,       // Features
  Mail, Lock, Phone, Eye, EyeOff,              // Auth
  Bell, Settings, HelpCircle, Shield,          // Settings
  TrendingUp, TrendingDown, Award, Crown,      // Stats
} from 'lucide-react';
```

**Size Convention:**
- Nav icons: 24px
- Card icons: 20px
- Chip icons: 16px
- Badge icons: 14px

---

## Accessibility

### **ARIA Labels**
```tsx
<button aria-label="Scan ingredients">
  <Camera size={24} />
</button>

<input 
  type="password" 
  aria-label="Password" 
  aria-describedby="password-error"
/>
```

### **Focus Management**
```css
*:focus-visible {
  outline: 2px solid #00FF9C;
  outline-offset: 2px;
}
```

### **Screen Reader Text**
```tsx
<span className="sr-only">Loading...</span>
```

---

## Performance Optimization

### **Lazy Loading**
```tsx
import { lazy, Suspense } from 'react';

const KwilRecipes = lazy(() => import('./KwilRecipes'));

<Suspense fallback={<LoadingSpinner />}>
  <KwilRecipes />
</Suspense>
```

### **Image Optimization**
```tsx
<img 
  src={recipe.image} 
  loading="lazy" 
  decoding="async"
  alt={recipe.name}
/>
```

### **Memoization**
```tsx
import { memo } from 'react';

export const RecipeCard = memo(({ recipe }) => {
  // Component logic
});
```

---

**Version:** 1.0.0
**Last Updated:** February 15, 2026
**Component Library:** Kwil AI Design System
