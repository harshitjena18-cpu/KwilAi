## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-10-20 - Consistent Focus States on Custom Styled Buttons
**Learning:** When adding focus-visible states to custom styled buttons with strong backdrop filters and gradients, specific offsets and contrasting colors (like ring-offset-[#050B08]) are needed to ensure the focus ring remains visible against both dark backgrounds and neon accents.
**Action:** Always test focus states on newly created custom styled buttons and ensure the focus ring is clearly distinguishable from the button's background and surrounding elements.
