## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-24 - Interactive Chip Accessibility Pattern
**Learning:** The custom `KwilChip` component pattern in this application implements clickability on a `div` wrapper. This creates an accessibility gap where interactive chips cannot be focused or activated via keyboard, unlike native buttons.
**Action:** Always enhance clickable custom components (like chips or cards) with `role="button"`, `tabIndex={0}`, `onKeyDown` handlers for Enter/Space, and explicit `focus-visible` utility classes to ensure parity with native interactive elements.
