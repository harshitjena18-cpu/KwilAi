## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-03-31 - Shopping List Button Accessibility
**Learning:** Icon-only buttons in dense interactive interfaces like shopping lists (e.g., share, download, back, delete, confirm) often completely lack descriptive labels, rendering them inaccessible to screen readers in this application's components.
**Action:** Always verify icon-only `<button>` elements in list-view components have explicit `aria-label` attributes describing their function, particularly for repetitive item-level actions like toggling or deleting.
