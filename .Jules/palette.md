## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Interactive Div Accessibility
**Learning:** Interactive components built with `<div>` elements (like custom chips) and an `onClick` handler fail to provide keyboard accessibility and semantic meaning. Screen readers don't know they are actionable, and keyboard-only users can't trigger them or see when they have focus. Additionally, icon-only child elements (like a generic '×' remove button) lack accessible names.
**Action:** Always verify that custom interactive elements include native keyboard access (`role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space), `focus-visible` styles, and descriptive `aria-label`s for icon-only sub-actions.
