## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-11-05 - Add keyboard focus styles to navigation items
**Learning:** Found that the main navigation items in KwilNavBar lack focus indicators, making it difficult for keyboard users to track their position when tabbing through the interface. This is a crucial accessibility issue for the primary navigation component.
**Action:** Adding standardized focus-visible Tailwind classes (`focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]`) to the navigation buttons to ensure keyboard accessibility.
