## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Custom Progress Indicator Accessibility
**Learning:** Custom progress bars implemented purely with generic `div` elements (like `KwilProgress`) are completely invisible to screen readers without explicit ARIA attributes.
**Action:** Always add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to custom progress implementations. If a visible label is present, associate it using a unique `id` (e.g., via React's `useId()`) and `aria-labelledby` to ensure the label is announced.
