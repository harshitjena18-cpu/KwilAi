## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-10-16 - KwilChip Keyboard Navigation
**Learning:** Components acting as buttons (like chips with onClick handlers) need explicit roles, tab indices, and Enter/Space keydown handlers to be fully accessible. Adding `focus-visible` styles ensures proper focus rings only for keyboard users.
**Action:** Always add keyboard accessibility (tabIndex, role, onKeyDown) and focus-visible states when creating custom interactive components (like divs with onClick).
