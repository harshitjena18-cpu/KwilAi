## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-21 - Interactive Chip Accessibility
**Learning:** Chip components (like filters or tags) implemented as `div` elements with `onClick` handlers are inaccessible to keyboard users and screen readers.
**Action:** Render interactive chips as `<button type="button">` to ensure native keyboard focus and activation. Use `aria-pressed` for toggle states and `aria-label` for secondary actions (like remove).
