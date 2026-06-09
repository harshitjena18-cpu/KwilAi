## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-06-09 - Icon-Only Button Accessibility
**Learning:** Icon-only buttons without `aria-label` attributes are invisible to screen readers, making core actions like 'Back' or 'Share' completely inaccessible.
**Action:** Always add descriptive `aria-label` attributes to buttons that rely solely on icons for visual communication.
