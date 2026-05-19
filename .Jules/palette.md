## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-21 - Icon Button Accessibility
**Learning:** Icon-only buttons and hover-revealed actions (like delete buttons) often lack `aria-label` attributes and remain invisible during keyboard navigation if they only rely on `group-hover:opacity-100`.
**Action:** Always add descriptive `aria-label` attributes to icon-only buttons. For hover-revealed elements, explicitly include `focus-visible:opacity-100` and a visible focus ring (e.g. `focus-visible:ring-2 focus-visible:ring-[#00FF9C]`) to ensure keyboard accessibility.
