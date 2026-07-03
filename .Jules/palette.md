## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-07-03 - Added accessibility attributes to Progress component
**Learning:** Custom progress bar elements need explicit `role="progressbar"` and ARIA value attributes to be properly interpreted by screen readers.
**Action:** Always include `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` on custom progress components.
