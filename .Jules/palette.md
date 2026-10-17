## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-10-17 - Standardize Focus Rings on KwilButton
**Learning:** Found that the main interactive component `KwilButton` was missing keyboard focus states (`focus-visible`), reducing accessibility for keyboard navigation.
**Action:** When adding keyboard support, utilize the standard focus rings defined in the application's aesthetic (`focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]`) to ensure a uniform accessibility experience.
