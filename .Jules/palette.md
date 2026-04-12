## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-21 - Icon-Only Button Labels in Components
**Learning:** Icon-only interactive elements in reusable components (like KwilRecipeDetail.tsx) often lack \`aria-label\` attributes, rendering them inaccessible to screen readers which will just announce "Button". This is especially common when wrapping icons in customized `<motion.button>` elements.
**Action:** Whenever introducing or modifying icon-only buttons, especially those using external libraries like Lucide and Framer Motion, always explicitly add descriptive \`aria-label\` attributes (and make them dynamic if the state changes, e.g., Favorite vs Unfavorite).
