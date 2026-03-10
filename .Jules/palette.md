## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2025-02-24 - Interactive Custom Chips Accessibility
**Learning:** Interactive elements implemented as a `div` with an `onClick` handler (like custom chips) completely bypass native keyboard access and focus indication, rendering them unusable for keyboard and screen reader users. Additionally, nested delete/remove buttons lacking descriptive `aria-label`s provide no context to assistive technologies.
**Action:** Always explicitly add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler (for Enter/Space keys) to `div`-based interactive elements. Ensure `focus-visible` styles are applied for clear focus indication, and dynamically generate descriptive `aria-label`s for nested icon buttons referencing the item's text.
