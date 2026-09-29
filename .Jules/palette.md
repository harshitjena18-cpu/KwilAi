## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-09-29 - Icon-Only Button ARIA Labels
**Learning:** This application's custom UI components frequently use icon-only buttons (e.g., Back, Share, Download, Add, Delete) which lack descriptive ARIA labels, making them inaccessible to screen readers.
**Action:** Always ensure that icon-only interactive elements include appropriate `aria-label` attributes to describe their function.
