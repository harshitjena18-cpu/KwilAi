## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Custom Progress Indicator Accessibility
**Learning:** Custom progress bars implemented with `div` elements lack implicit semantics, making them invisible or confusing for screen reader users unless explicit ARIA attributes are provided.
**Action:** Always verify custom progress components against WAI-ARIA patterns. Ensure `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` are present. Use `aria-labelledby` to associate the progress bar with its visual label text.
