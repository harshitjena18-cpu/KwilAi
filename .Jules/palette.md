## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Icon-only Buttons Pattern
**Learning:** Across the Kwil components, icon-only buttons frequently lack `aria-label` attributes. This pattern severely impacts screen reader usability.
**Action:** Always verify that buttons containing only icons have descriptive `aria-label` attributes.
