## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2025-05-18 - Shopping List Accessibility
**Learning:** When using `group-hover:opacity-100` for elements like list item delete buttons, the parent container MUST explicitly have the `group` class. Additionally, interactive hover-only elements require `focus-visible:opacity-100` to be accessible via keyboard navigation.
**Action:** Always verify parent `group` class presence and append `focus-visible:opacity-100` when implementing hover-only interactive controls.
