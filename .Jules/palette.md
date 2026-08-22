## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-08-22 - Keyboard navigation for hover-hidden elements
**Learning:** When using `opacity-0` with `group-hover:opacity-100` to hide action buttons until hover, they remain invisible during keyboard traversal unless explicitly shown.
**Action:** Always add `focus-visible:opacity-100` along with focus rings to ensure visually hidden interactive elements appear for keyboard users.
