## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-10-05 - Keyboard Accessible Hover Actions
**Learning:** Custom list actions in Kwil Shopping List use visually hidden states (`opacity-0 group-hover:opacity-100`) which are completely inaccessible to keyboard users as they lack focus styles to force visibility.
**Action:** When implementing hover-revealed actions on list items, always pair `opacity-0 group-hover:opacity-100` with `focus-visible:opacity-100` and explicit keyboard focus rings.
