## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-06-06 - A11y roles on inline Checkboxes
**Learning:** When making inline checklist items with custom button-based checkboxes in a list UI, it's very common to only have click handlers and omit both `aria-label` (to name what is being toggled) and `role="checkbox"` (to expose state).
**Action:** Always ensure list item toggles use `role="checkbox"` and `aria-checked` rather than acting as opaque toggle buttons, and include the item name in the aria-label.
