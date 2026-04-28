## 2026-04-28 - Adding ARIA labels to icon-only buttons
**Learning:** The Shopping List had numerous icon-only buttons (back, share, delete, etc.) that lacked ARIA labels, making them inaccessible to screen readers. Focus states for keyboard navigation were also missing.
**Action:** Add explicit `aria-label`s to all icon-only buttons, dynamic aria-labels based on state for checkbox-style buttons, and explicit `focus-visible` utility classes for keyboard accessibility.
