## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-06-05 - Hover State Accessibility
**Learning:** Hover-only actions using Tailwind's group-hover require the parent element to have the group class, and must include focus-visible states for keyboard users.
**Action:** Always verify group-hover components have the group class on the parent and explicit focus-visible styles.
