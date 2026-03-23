## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2025-02-28 - Keyboard Event Bubbling in Nested Custom Components
**Learning:** When nesting a native `<button>` (e.g., a remove icon) inside a custom interactive `<div role="button">` (like a chip), native buttons automatically translate 'Enter' and 'Space' keypresses into click events. To prevent these synthetic click events from bubbling up and triggering the parent's action on keypress, adding an `onKeyDown` handler to the inner button that calls `e.stopPropagation()` is required (in addition to `onClick` propagation).
**Action:** Always verify `onKeyDown` event bubbling behavior when building nested interactive custom components. Ensure inner semantic interactive elements handle stopPropagation for keyboard events alongside standard click events to avoid duplicate parent executions.
