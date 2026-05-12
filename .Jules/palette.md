## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-21 - Focus Visible on Hover-Only Buttons
**Learning:** Elements that only appear on hover (like delete buttons in lists) become inaccessible via keyboard if they lack focus-visible styles that force them to appear.
**Action:** Always add focus-visible:opacity-100 (or equivalent) to elements using opacity-0 group-hover:opacity-100 so they remain visible when focused.
