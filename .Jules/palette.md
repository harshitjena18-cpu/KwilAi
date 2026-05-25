## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-25 - Added ARIA Labels to Recipe Detail Buttons
**Learning:** Icon-only interactive elements in Framer Motion components often omit accessibility attributes. Applying `focus-visible` utility classes alongside `aria-label`s is necessary to support both screen reader and keyboard navigation simultaneously.
**Action:** Always verify that `motion.button` components with icon children include explicit `aria-label` and `focus-visible` styles.
