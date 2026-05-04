## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-04 - Adding accessibility to icon-only buttons
**Learning:** Icon-only buttons implemented with custom styling (like framer-motion or inline styles) frequently miss critical accessibility attributes, making them invisible or meaningless to screen readers and keyboard users.
**Action:** Always ensure `aria-label` attributes are present on icon-only buttons, and use explicit Tailwind utilities like `focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2` (and `focus-visible:opacity-100` if the button relies on hover states) to ensure proper keyboard focus management.
