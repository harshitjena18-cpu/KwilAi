## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-19 - Interactive Chip Keyboard Nav
**Learning:** Nested interactive elements (like a remove button inside a clickable chip) require careful event propagation handling for keyboard events (`e.key === 'Enter' || e.key === ' '`). Native `<button>` elements trigger a click event on Enter/Space, which bubbles up to the parent. However, if the parent is a `<div>` with an `onKeyDown` handler to simulate a button, pressing Enter/Space on the native child button will also trigger the parent's `onKeyDown` logic unless `e.stopPropagation()` is explicitly called in a separate `onKeyDown` handler on the child.
**Action:** When adding an interactive child element inside a custom interactive parent element, always add an `onKeyDown` handler to the child that calls `e.stopPropagation()` for Enter and Space keys to prevent double-execution of actions.
