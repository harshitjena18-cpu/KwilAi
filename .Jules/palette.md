## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-24 - Interactive Chip Accessibility
**Learning:** Custom interactive elements (like chips that act as buttons) lacking native `button` attributes create major accessibility issues. Specifically, missing `role="button"`, `tabIndex={0}`, keyboard event handlers (`onKeyDown`), and `focus-visible` styles prevent keyboard and screen reader users from accessing them.
**Action:** Whenever converting a non-interactive element (like a `div`) into an interactive one via an `onClick` handler, explicitly apply ARIA roles, `tabIndex`, and a keydown listener for "Enter" and "Space". Always ensure inner icon buttons have an `aria-label`.
