## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-04-13 - Accessible Icon Buttons
**Learning:** Custom icon-only buttons often lack accessible names, meaning screen readers only read 'button' without context.
**Action:** Always add descriptive `aria-label` attributes to icon-only interactive elements (e.g., share, download, confirm buttons) so assistive technologies can announce their purpose.
