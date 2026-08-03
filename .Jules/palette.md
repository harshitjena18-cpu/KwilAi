## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-08-03 - Dynamic ARIA Labels in Lists
**Learning:** Icon-only buttons within repeating list items require contextual accessible names (e.g., incorporating the item's name) rather than generic labels, ensuring screen reader users can distinguish between identical actions.
**Action:** Always interpolate item-specific identifiers (like `item.name`) into the `aria-label` for list item actions.
