## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-07-07 - KwilShoppingList Icon-Only Buttons
**Learning:** Icon-only buttons used for primary actions (like going back, adding items, toggling completion status, and deleting items) in `KwilShoppingList` lack `aria-label`s, rendering them inaccessible to screen readers. This pattern suggests a need for stricter accessibility checks when building custom components.
**Action:** Ensure all interactive elements, particularly those relying solely on icons for visual communication, include descriptive `aria-label` attributes to maintain full screen reader support and accessibility.
