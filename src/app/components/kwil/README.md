# Kwil AI Design System

A complete mobile app design system for an AI-powered food and recipe app with a dark futuristic UI featuring glassmorphism and neon glow effects.

## Theme

### Colors
- **Background**: `#050B08` (Deep Black / Dark Green)
- **Primary**: `#00FF9C` (Neon Green)
- **Secondary**: `#10B981` (Emerald)
- **Accent**: `#5CFFD1` (Mint Glow)
- **Text Primary**: `#FFFFFF` (White)
- **Text Secondary**: `#A0A0A0` (Light Gray)

### Effects
- Subtle blur backgrounds (Glassmorphism)
- Neon glow shadows
- Soft reflections
- Floating card animations
- Capsule shaped buttons with 14px radius

### Typography
- **Font Family**: Inter / SF Pro / Poppins
- **Headings**: Bold / SemiBold
- **Body**: Regular
- **Buttons**: Medium

## Components

### KwilButton
Capsule-shaped button with glow effects and gradient fills.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'ghost'`
- `size`: `'sm' | 'md' | 'lg'`
- `fullWidth`: `boolean`

**Usage:**
```tsx
<KwilButton variant="primary" size="md" fullWidth>
  Click Me
</KwilButton>
```

### KwilInput
Glassmorphic input field with neon border focus state.

**Props:**
- `label`: `string`
- `error`: `string`
- `icon`: `React.ReactNode`

**Usage:**
```tsx
<KwilInput 
  label="Email"
  placeholder="Enter your email"
  icon={<Search size={20} />}
/>
```

### KwilCard
Floating glassmorphic card with optional glow and hover effects.

**Props:**
- `glow`: `boolean` - Adds neon glow shadow
- `hover`: `boolean` - Enables hover animation
- `onClick`: `() => void`

**Usage:**
```tsx
<KwilCard glow hover>
  <h4>Card Content</h4>
</KwilCard>
```

### KwilChip
Pill-shaped tag component with icons and optional remove button.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline'`
- `icon`: `React.ReactNode`
- `onRemove`: `() => void`

**Usage:**
```tsx
<KwilChip variant="primary" icon={<Flame />} onRemove={() => {}}>
  Trending
</KwilChip>
```

### KwilTabs
Tab switcher with neon active state and smooth transitions.

**Props:**
- `tabs`: `Array<{ id: string, label: string, icon?: ReactNode }>`
- `defaultTab`: `string`
- `onChange`: `(tabId: string) => void`

**Usage:**
```tsx
<KwilTabs 
  tabs={[
    { id: 'home', label: 'Home', icon: <Home /> },
    { id: 'search', label: 'Search', icon: <Search /> }
  ]}
  defaultTab="home"
  onChange={(tabId) => console.log(tabId)}
/>
```

### KwilNavBar
Bottom navigation bar with glowing active states.

**Props:**
- `items`: `Array<{ id: string, icon: ReactNode, label: string }>`
- `defaultActive`: `string`
- `onChange`: `(itemId: string) => void`

**Usage:**
```tsx
<KwilNavBar 
  items={[
    { id: 'home', icon: <Home />, label: 'Home' },
    { id: 'search', icon: <Search />, label: 'Search' }
  ]}
  defaultActive="home"
/>
```

### KwilSwitch
Toggle switch with neon gradient active state and accessibility support.

**Props:**
- `label`: `string` (Visual label, also provides accessible name via `aria-labelledby`)
- `checked`: `boolean`
- `defaultChecked`: `boolean`
- `onChange`: `(checked: boolean) => void`
- `aria-label`: `string` (Required if `label` is not provided)
- `...props`: Standard button attributes

**Usage:**
```tsx
// With visual label (automatically accessible)
<KwilSwitch label="Dark Mode" defaultChecked />

// Without visual label (requires aria-label)
<KwilSwitch aria-label="Enable notifications" defaultChecked />
```

### KwilProgress
Progress bar with neon gradient fill.

**Props:**
- `value`: `number` (0-100)
- `label`: `string`
- `showPercentage`: `boolean`

**Usage:**
```tsx
<KwilProgress value={75} label="Cooking Progress" />
```

### KwilAvatar
User avatar with neon border and optional glow effect.

**Props:**
- `src`: `string`
- `name`: `string` - Used for initials if no image
- `size`: `'sm' | 'md' | 'lg' | 'xl'`
- `glow`: `boolean`

**Usage:**
```tsx
<KwilAvatar name="Sarah Logan" size="lg" glow />
```

### KwilBadge
Status badge with colored variants and optional dot indicator.

**Props:**
- `variant`: `'primary' | 'secondary' | 'success' | 'warning' | 'danger'`
- `size`: `'sm' | 'md'`
- `dot`: `boolean`

**Usage:**
```tsx
<KwilBadge variant="success" dot>Verified</KwilBadge>
```

## Layout Guidelines

- **Mobile Frame**: 390x844px
- **Grid System**: 8pt grid
- **Padding**: 16px / 24px consistent spacing
- **Border Radius**: 14px for buttons, 20-30px for cards

## Brand Personality

- Modern & Intelligent
- Reliable & Trustworthy
- Student-friendly
- Health-focused
- Premium tech startup aesthetic

**Emotion**: "Feels like using a personal AI chef"

## Installation

Import components from the Kwil design system:

```tsx
import { 
  KwilButton, 
  KwilInput, 
  KwilCard, 
  KwilChip, 
  KwilTabs,
  KwilNavBar,
  KwilSwitch,
  KwilProgress,
  KwilAvatar,
  KwilBadge
} from './components/kwil';
```

## Custom CSS Classes

Additional utility classes available in `/src/styles/kwil.css`:

- `.kwil-glass` - Glassmorphism effect
- `.kwil-glow-primary` - Primary neon glow
- `.kwil-gradient-primary` - Primary gradient background
- `.kwil-float` - Floating animation
- `.kwil-pulse-glow` - Pulsing glow animation
- `.kwil-holographic` - Holographic sweep effect
