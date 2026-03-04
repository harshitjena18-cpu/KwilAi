## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Interactive Div Accessibility
**Learning:** Custom interactive elements like chips (when implemented as a `div` with an `onClick` handler) miss native keyboard access and screen reader support. Additionally, icon-only buttons (like a close/remove button) require clear `aria-label` attributes.
**Action:** Always verify that elements with `onClick` handlers also have an associated `onKeyDown` (handling Enter/Space), `tabIndex={0}`, an appropriate `role` (like `button`), and `focus-visible` styles. Always add `aria-label` to icon-only buttons.
