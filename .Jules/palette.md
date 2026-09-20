## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-09-20 - Icon-Only Button Accessibility Pattern
**Learning:** Icon-only interactive elements in complex layouts (like Shopping Lists with actions per item) require both descriptive `aria-label` attributes and high-contrast, explicit keyboard focus states (`focus-visible`) for accessibility. Relying solely on hover states or SVG semantic meaning is insufficient for screen readers and keyboard-only navigation.
**Action:** Standardize applying `aria-label` and consistent Tailwind `focus-visible` utility rings to all icon-only action buttons across similar list components.
