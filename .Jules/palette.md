## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-10-23 - App-Specific Glassmorphic Buttons Lack Accessibility
**Learning:** This app heavily uses raw `<button>` elements with complex inline glassmorphic styles instead of the reusable `KwilButton` component for icon-only interactions, leading to a consistent pattern of missing focus indicators and `aria-label`s.
**Action:** When auditing new pages, prioritize checking inline styled buttons over component library buttons for accessibility gaps.
