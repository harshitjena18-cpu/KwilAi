## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Interactive Div Accessibility
**Learning:** Custom interactive elements like chips built with `<div>` and `onClick` handlers often lack keyboard accessibility and focus rings, making them inaccessible to keyboard users. When nesting interactive elements (like a remove button inside a chip), the parent's accessible name may inadvertently concatenate its text with the child's `aria-label`.
**Action:** When creating custom interactive `<div>`s, ensure they have `role="button"`, `tabIndex={0}`, an `onKeyDown` handler for Enter/Space keys, and visible `focus-visible` styles. Be mindful of concatenated text when setting `aria-label`s on nested elements.
