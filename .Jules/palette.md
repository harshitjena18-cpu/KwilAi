## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-03-29 - Add ARIA Labels to Icon-Only Motion Buttons
**Learning:** Icon-only buttons built with custom framer-motion components (`<motion.button>`) must include `aria-label` attributes to ensure screen reader accessibility, as the child elements (icons) do not provide semantic meaning on their own.
**Action:** Always verify custom interactive components, particularly those imported from external libraries like framer-motion, against WAI-ARIA patterns. Provide descriptive `aria-label` attributes to any interactive element lacking visible text.
