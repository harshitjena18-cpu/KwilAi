## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-11 - Shopping List Accessibility
**Learning:** Custom interactive list elements, like button-based checkboxes and icon-only delete actions, are completely opaque to screen readers if they lack `role="checkbox"`, `aria-checked`, and `aria-label` attributes. Furthermore, actions that appear on hover (`opacity-0 group-hover:opacity-100`) become inaccessible to keyboard users unless they also have a `focus-visible:opacity-100` class.
**Action:** Always ensure icon-only buttons include explicit `aria-label` attributes and custom checkboxes include `role="checkbox"` with `aria-checked`. For hover-revealed actions, always provide a focus-visible state to maintain keyboard accessibility.
