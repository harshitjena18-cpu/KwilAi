## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Interactive Chip Accessibility
**Learning:** Custom chips (`KwilChip`) implemented with `onClick` handlers as `div` elements lack keyboard navigability and semantics, making them invisible and inaccessible to keyboard and screen reader users.
**Action:** When adding interactivity to non-interactive elements, implement the `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter/Space) patterns, along with `focus-visible` styles to ensure full keyboard support. For delete/remove sub-actions, ensure the `aria-label` is descriptive by referencing the item's text.
