## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Custom Chip Accessibility
**Learning:** Custom interactive elements (like chips with `onClick` handlers) built using `div` tags lack native keyboard support. They require explicit `role="button"`, `tabIndex={0}`, and `onKeyDown` handling (Space/Enter). Furthermore, nested interactive elements (like an 'x' remove button) need their own descriptive `aria-label`s to be meaningful to screen reader users.
**Action:** Always verify custom `div`-based components for interactive capability. Implement full keyboard navigability (`tabIndex`, `onKeyDown`) and ensure nested controls have context-aware `aria-label`s and visible focus rings (`focus-visible`).
