## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-03-12 - Custom Progress Component Accessibility
**Learning:** Custom progress bar components built with standard `div` elements lack native semantic meaning. Without appropriate ARIA roles and attributes, screen readers cannot interpret them as progress indicators, preventing users from accessing their status or labels.
**Action:** Always add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to custom `div`-based progress bars. Furthermore, use `useId()` to generate unique IDs and link visible labels to the progress bar via `aria-labelledby` to ensure the component is fully accessible and understandable by assistive technologies.
