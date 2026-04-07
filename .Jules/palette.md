## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Icon-only buttons accessibility
**Learning:** Icon-only buttons in complex lists and headers are common in this app but often miss accessible names. Without `aria-label`, screen readers just say 'button'.
**Action:** Always add `aria-label` to icon-only buttons, especially in list items and header actions, to ensure they are accessible.
