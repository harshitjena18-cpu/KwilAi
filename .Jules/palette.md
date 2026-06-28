## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-06-28 - Progress Bar Accessibility
**Learning:** Custom progress bars implemented with generic divs do not expose their progress state to assistive technologies.
**Action:** Always include role='progressbar' and appropriate aria-value attributes (aria-valuenow, aria-valuemin, aria-valuemax) on custom progress indicators.
