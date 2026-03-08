## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2025-03-08 - Custom Progress Bar Accessibility
**Learning:** Custom progress bars implemented with `div` elements lack semantic meaning and value context for screen readers by default. The visual label and the progress value must be explicitly communicated.
**Action:** When building custom progress bars, always apply `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`. If a visual label exists, use React's `useId()` to generate a unique ID and link the label to the progress bar container using `aria-labelledby`.
