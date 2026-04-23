## 2026-04-23 - Focus Visible States
**Learning:** Keyboard accessibility is often missed on custom UI components like buttons and navbars, which rely on mouse/touch interactions primarily. Adding clear `focus-visible` states ensures keyboard users can navigate the UI.
**Action:** Always include `focus:outline-none focus-visible:ring-2 focus-visible:ring-[color] focus-visible:ring-offset-2` classes on interactive elements.
