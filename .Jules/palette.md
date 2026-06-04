## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-06-04 - Hidden Actions Accessibility
**Learning:** Hover-only UI actions (like a delete button visible on group-hover) can become completely inaccessible if the parent container is missing the `group` class. Additionally, such elements remain hidden from keyboard users unless they explicitly include `focus-visible:opacity-100` and proper focus indicators. Icon-only buttons also require an `aria-label` for screen readers.
**Action:** Whenever adding `group-hover` styles, always ensure the parent container actually has the `group` class. Also, ensure hover-only UI elements have `focus-visible:opacity-100`, focus rings, and proper ARIA labels so they remain accessible for keyboard navigation and screen readers.
