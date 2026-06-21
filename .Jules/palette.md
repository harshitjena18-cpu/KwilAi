## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-21 - Icon-Only Button Accessibility in UpgradePage
**Learning:** Icon-only navigation buttons like the back arrow in UpgradePage.tsx lacked accessible names, making them unreadable for screen readers.
**Action:** Ensure all icon-only interactive elements use explicit aria-label attributes to provide clear context for assistive technologies.
