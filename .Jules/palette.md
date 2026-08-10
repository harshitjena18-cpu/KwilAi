## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-08-10 - Interactive Elements Visibility
**Learning:** Actions that are visually hidden by default (e.g. opacity-0 on list items) become inaccessible to keyboard users unless they are explicitly made visible on focus.
**Action:** Always include `focus-visible:opacity-100` along with focus rings for hover-only actions.
