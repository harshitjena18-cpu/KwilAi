## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-21 - Reveal-on-Hover Accessibility
**Learning:** Elements styled with `opacity-0 group-hover:opacity-100` (like list item delete buttons) are inaccessible to keyboard users because they cannot "hover".
**Action:** When creating hover-revealed elements, always add `focus-visible:opacity-100` and ensure the parent container has the `group` class. Also ensure a visible focus ring is applied to the revealed element.
