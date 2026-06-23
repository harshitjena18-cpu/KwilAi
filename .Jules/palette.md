## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-23 - Added accessibility to button-based checkboxes
**Learning:** Custom interactive elements like button-based inline checkboxes rely solely on visual changes unless explicitly configured. Screen readers need proper roles and state exposure.
**Action:** Always include `role="checkbox"` and `aria-checked={boolean}` on custom button checkboxes to expose the correct state to assistive technologies.
