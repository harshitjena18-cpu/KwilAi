## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-05-20 - Icon-only button accessibility in Framer Motion
**Learning:** Framer Motion's <motion.button> is frequently used for icon-only actions across the app (29+ instances) but systematically lacks aria-label attributes and keyboard focus indicators, rendering them inaccessible to screen readers and keyboard users.
**Action:** Whenever implementing or reviewing <motion.button> for icons, strictly enforce adding descriptive aria-label attributes and Tailwind focus rings (focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C]).
