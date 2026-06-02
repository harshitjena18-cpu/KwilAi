## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-02-15 - Icon-only buttons lacking ARIA labels
**Learning:** The application uses many custom icon-only buttons (like back, share, download) that look great visually but lack explicit accessible names, causing screen readers to announce them just as 'button'. This is a common pattern across many components.
**Action:** Add `aria-label` to all icon-only buttons, and use `role="checkbox"` with `aria-checked` for custom visual toggle elements instead of just relying on click handlers.
