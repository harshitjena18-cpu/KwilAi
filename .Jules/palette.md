## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-23 - Accessibility of custom checkbox elements
**Learning:** When implementing custom interactive elements like checkboxes using buttons, they require both `role="checkbox"` and `aria-checked` attributes to correctly announce their state to screen readers.
**Action:** Verify all custom interactive elements, especially toggles/checkboxes, not only have labels but also expose their role and semantic state accurately via ARIA attributes.
