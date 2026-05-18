## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-18 - Invisible group-hover actions
**Learning:** Tailwind `group-hover` on child elements requires the `group` class on the parent, otherwise they never become visible. Also, hover-only UI elements need explicit `focus-visible:opacity-100` along with focus rings so keyboard users can navigate to them.
**Action:** Always verify parent `group` classes exist when using `group-hover`, and strictly add `focus-visible:opacity-100` and `aria-label`s to all icon-only list actions.
