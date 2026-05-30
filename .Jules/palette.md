## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-30 - Missing ARIA Labels on Framer Motion Buttons
**Learning:** The `motion.button` components used for icon-only actions (like Back, Favorite, Share) across the app consistently lack `aria-label` attributes, making them inaccessible to screen reader users.
**Action:** Always add descriptive `aria-label`s to icon-only interactive elements, dynamically updating them if the button state changes (e.g., favorite vs. unfavorite).
