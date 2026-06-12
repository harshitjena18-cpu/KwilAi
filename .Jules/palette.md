## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-12 - Custom Checkbox Accessibility
**Learning:** Custom interactive list elements like button-based inline checkboxes are completely invisible to assistive technologies if they only rely on visual changes and click handlers.
**Action:** Always include `role="checkbox"` and `aria-checked={boolean}` alongside a descriptive `aria-label` to expose the correct interactive state to screen readers.
