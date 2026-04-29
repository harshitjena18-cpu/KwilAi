
## 2026-04-29 - Interactive Icon Buttons Accessibility
**Learning:** Icon-only interactive elements in lists (like checkboxes and delete buttons) frequently lack `aria-label`s for screen readers and `focus-visible` styles for keyboard navigation, making list management inaccessible.
**Action:** Always provide contextual `aria-label`s (e.g., 'Delete [Item Name]') and explicit Tailwind `focus-visible:ring` styles on icon buttons, ensuring hover-only elements (like delete buttons) add `focus-visible:opacity-100` so they appear when tabbed to.
