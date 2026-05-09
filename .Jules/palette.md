## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-09 - Shopping List A11y Fixes
**Learning:** The 'group' class is required on parent containers for 'group-hover' to trigger on children. 'focus-visible:opacity-100' is crucial for visually hidden elements that need to appear on keyboard focus. Ensure interactive buttons always have an 'aria-label' if they lack text content.
**Action:** Always verify keyboard accessibility on hover-dependent elements.
