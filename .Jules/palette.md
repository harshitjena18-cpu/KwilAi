## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-06-13 - Shopping List Accessibility
**Learning:** Custom checkbox buttons in interactive lists often lack proper roles and aria-checked attributes, and icon-only buttons should always have aria-labels to provide meaningful contexts.
**Action:** Always verify custom interactive elements against WAI-ARIA patterns and include aria-label on icon-only buttons.
