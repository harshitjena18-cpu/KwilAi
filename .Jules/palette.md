## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-23 - Interactive List Items
**Learning:** When using custom checkmark buttons and delete icons inside list items, failing to add 'group' to the parent prevents 'group-hover' utilities from functioning, and omitting 'focus-visible:opacity-100' renders hover-only elements completely inaccessible via keyboard navigation.
**Action:** Always add 'group' to the parent container when relying on group-hover, and strictly ensure that elements revealing on hover also reveal on keyboard focus with 'focus-visible:opacity-100'.
