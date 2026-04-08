## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-04-08 - Dynamic Aria Labels in Lists
**Learning:** Icon-only buttons mapped over a list (like Delete buttons for shopping items) require dynamic ARIA labels containing the item's name (e.g., Delete [item name]) so screen readers can distinguish between multiple identical icon-only buttons.
**Action:** When mapping over lists to render icon-only buttons, always interpolate the item's name or ID into the `aria-label`.
