## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-05-29 - ARIA Labels and Focus States for Icon Buttons
**Learning:** Icon-only interactive elements lacking ARIA labels and focus-visible states cause significant accessibility issues for screen reader and keyboard users.
**Action:** Always ensure `aria-label` and explicit `focus-visible` utility classes (like `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`) are applied to all icon-only buttons in the UI.
