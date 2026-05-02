## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-05-02 - Icon-Only Button Accessibility in Framer Motion
**Learning:** Icon-only buttons implemented with `<motion.button>` frequently lack `aria-label`s, causing them to be read as empty or unlabelled buttons by screen readers. This pattern is common in visually-heavy animated interfaces.
**Action:** Always ensure that icon-only buttons (like Back, Favorite, or Bookmark) receive descriptive `aria-label` attributes, regardless of whether they are standard `<button>`s or animated `<motion.button>`s.
