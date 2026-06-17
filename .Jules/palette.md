## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-17 - Custom Inline Checkbox List
**Learning:** Custom interactive list elements like button-based inline checkboxes often lack the necessary ARIA attributes to expose their state to screen readers.
**Action:** Always include role="checkbox" and aria-checked={boolean} on custom checkbox buttons to expose the correct state to assistive technologies, rather than relying solely on visual changes or click handlers.
