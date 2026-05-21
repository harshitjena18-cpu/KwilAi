## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-21 - Custom Motion Button Accessibility
**Learning:** Icon-only custom components implemented with `<motion.button>` (Framer Motion) often lack descriptive `aria-label` attributes, leaving screen reader users without context for interactive elements.
**Action:** Always ensure that any icon-only interactive components explicitly include descriptive `aria-label` attributes for proper accessibility.
