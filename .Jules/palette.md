## 2026-03-18 - Interactive Custom Chips Accessibility
**Learning:** Interactive elements implemented as a `div` with an `onClick` handler (like custom chips) must include native keyboard access (`role="button"`, `tabIndex={0}`, `onKeyDown` handling for Enter/Space keys) and `focus-visible` styles to ensure accessibility compliance. Any nested delete/remove buttons must include descriptive `aria-label`s referencing the item's text.
**Action:** Always verify custom interactive `div` elements against keyboard accessibility patterns and ensure nested interactive elements have proper context for screen readers.

## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
