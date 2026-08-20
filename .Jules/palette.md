## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Keyboard accessibility for hidden actions
**Learning:** Icon buttons that are visually hidden by default (e.g., using `opacity-0` and shown on hover) are inaccessible to keyboard users because they remain invisible during tab traversal.
**Action:** Always include `focus-visible:opacity-100` alongside hover classes to ensure keyboard users can see where their focus is and access hidden controls.
