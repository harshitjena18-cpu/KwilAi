## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-06-16 - Accessible Icon-Only Buttons
**Learning:** Icon-only buttons (like Back, Share, or Favorite buttons) built using abstract components (e.g., `motion.button`) frequently lack accessible names by default, leading to critical accessibility violations for screen reader users.
**Action:** Always verify that every icon-only interactive element has an explicit `aria-label` or `aria-labelledby` attribute describing its function.
