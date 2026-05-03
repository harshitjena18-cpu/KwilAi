## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-03 - Shopping List Accessible Controls
**Learning:** Icon-only buttons implemented with custom styling must include descriptive `aria-label`s and explicit `focus-visible` utility classes for keyboard accessibility. Furthermore, hover-only reveal patterns (like `opacity-0 group-hover:opacity-100`) break keyboard navigation unless paired with `focus-visible:opacity-100` and the parent element has the `group` class.
**Action:** Always add `aria-label` and `focus-visible` classes to custom interactive components, and ensure hover-revealed elements are keyboard accessible.
