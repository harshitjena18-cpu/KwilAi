## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Interactive Chip Semantics
**Learning:** Chip components often mix semantics (Button vs. Tag vs. Interactive Container), leading to accessibility issues like `div` buttons or nested interactive controls.
**Action:** Use a conditional root element strategy: render as `<button type="button">` for simple actions (filters), and accessible `<div>` (with `role` and keyboard handlers) only when complex content (like a remove button) requires it.
