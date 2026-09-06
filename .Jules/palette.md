## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-22 - Dynamic ARIA Labels and Hidden Controls
**Learning:** Icon-only list actions require dynamic aria-labels (e.g. `Delete ${item.name}`), and hover-revealed buttons must use `focus-visible:opacity-100` along with standard focus states so they become visible when navigating via keyboard.
**Action:** Add dynamic aria-labels and explicit focus opacity classes to hidden elements.
