## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-18 - Hover-only actions and Keyboard Accessibility
**Learning:** Tailwind's `group-hover` utility hides secondary actions until hovered, but requires the `group` class on the parent element. Furthermore, hover-only elements are invisible to keyboard navigation, degrading accessibility.
**Action:** When fixing missing `group` classes, always add `focus-visible:opacity-100 focus-visible:ring-2 focus:outline-none` and an `aria-label` to the child element so it appears properly when tabbed into.
