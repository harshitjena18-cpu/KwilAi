## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-09-30 - Consistent Keyboard Focus Ring Classes
**Learning:** The application uses a standard set of Tailwind classes (`focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]`) to provide consistent and highly visible keyboard focus rings. The `KwilButton` was missing these standard application classes.
**Action:** When creating or updating interactive components in this design system, ensure they include the standard application focus ring classes to maintain a consistent keyboard navigation experience.
