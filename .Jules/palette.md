## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-05-27 - Accessible Hover Actions
**Learning:** Hover-only UI elements using Tailwind's `group-hover` need the parent to explicitly declare the `group` class. Additionally, such elements need explicit `focus-visible:opacity-100`, focus rings, and `aria-label` attributes to remain accessible for keyboard navigation and screen readers.
**Action:** Ensure `group` is added to parents for nested hovers, and always map hover-revealed states to `focus-visible` states with an `aria-label` for screen readers.
