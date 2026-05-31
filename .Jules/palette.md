## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-05-31 - Missing group class on group-hover elements
**Learning:** When using Tailwind's `group-hover` modifier (e.g., `group-hover:opacity-100`) on a child element, ensure the parent container explicitly includes the `group` class, otherwise the state won't trigger. Additionally, hover-only UI elements need explicit `focus-visible:opacity-100` and focus rings to remain accessible for keyboard navigation.
**Action:** Always verify parent elements contain `group` when using `group-hover`. Add `focus-visible` opacity and outline styles to any elements that only appear on hover so keyboard users can access them.
