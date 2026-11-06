## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-11-06 - Focus Visible Styles for KwilButton
**Learning:** Using focus-visible outline and ring utilities across button components ensures proper keyboard navigation accessibility while hiding focus rings from mouse users.
**Action:** Always include focus-visible styles on interactive elements following the standard ring-2 ring-[#00FF9C] pattern.
