## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-06-15 - Custom Checkbox List Accessibility
**Learning:** Custom lists featuring item-specific actions (like check/delete) built with generic `<button>` tags lack context for screen reader users. An icon-only delete button just reads 'Button', and a custom checkbox without `role="checkbox"` and `aria-checked` fails to convey its state.
**Action:** When implementing list item controls, ensure custom checkboxes use `role="checkbox"` and `aria-checked`. Always use dynamic `aria-label`s (e.g., `aria-label="Delete ${item.name}"`) to provide specific context for each item's actions.
