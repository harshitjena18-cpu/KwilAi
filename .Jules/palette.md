## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-07 - Keyboard Accessibility for Hover-only Actions
**Learning:** When using the `opacity-0 group-hover:opacity-100` pattern for interactive elements (like delete buttons), they remain invisible during keyboard navigation. Additionally, the parent container must have the `group` class for the hover state to work.
**Action:** Always append `focus-visible:opacity-100` to hover-only interactive elements and ensure the parent has the `group` class.
