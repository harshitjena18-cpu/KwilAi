## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-21 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons (like header actions) often lack ARIA labels and focus indicators, preventing screen readers from identifying them and keyboard users from navigating them easily.
**Action:** Always verify icon-only buttons have an explicit `aria-label` and adequate keyboard focus classes (`focus-visible`).
