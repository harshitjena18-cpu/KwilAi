## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-24 - Expose progress state to assistive technologies
**Learning:** Custom progress components built with `div`s are completely invisible to screen readers without proper ARIA attributes.
**Action:** Always include `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` on custom progress bars, and properly link them to their visible labels using `aria-labelledby` while hiding the visible text from screen readers with `aria-hidden="true"` to prevent duplicate announcements.
