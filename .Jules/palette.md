## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-22 - Tailwind group-hover and focus-visible on hidden elements
**Learning:** When using `opacity-0 group-hover:opacity-100` on a child element (like a list item delete button), the parent container must explicitly have the `group` class for the hover state to trigger. Additionally, to ensure these hover-only elements are accessible via keyboard navigation, they must include `focus-visible:opacity-100` along with focus ring styles.
**Action:** Always verify parent containers have `group` when using `group-hover`, and always add `focus-visible:opacity-100` and clear focus indicators to elements that are hidden by default but become interactive on hover.
