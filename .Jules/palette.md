## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-22 - Accessible Tabs Keyboard Navigation
**Learning:** Custom tab components built from scratch frequently lack basic accessibility roles (`tablist`, `tab`) and visible focus outlines, rendering them unusable for keyboard and screen reader users.
**Action:** Always ensure custom tab components implement `role="tablist"`, `role="tab"`, `aria-selected`, and explicit `focus-visible` styles.
