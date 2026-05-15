## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-15 - Missing Hover Groups
**Learning:** Tailwind's `group-hover` modifier on an inner element requires an explicit `group` class on a parent container to function. Keyboard navigability for hover-revealed elements requires `focus-visible:opacity-100`.
**Action:** Always ensure the parent container includes the `group` class when using `group-hover`, and strictly pair hover reveals with focus visibility for keyboard users.
