## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-10-15 - KwilButton Focus Indicator Accessibility Pattern
**Learning:** Common base components like \`KwilButton\` require explicit focus states to ensure keyboard accessibility. Without these, components utilizing them throughout the application lack sufficient visibility during keyboard navigation, which disrupts the screen reader user experience.
**Action:** Append the standardized accessibility Tailwind classes (\`focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]\`) to the \`baseStyles\` within \`KwilButton.tsx\`.
