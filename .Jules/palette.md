## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2026-06-26 - ARIA Labeling on Recipe Detail Page
**Learning:** The KwilRecipeDetail page contained several interactive elements (Back, Favorite, Share, Voice command) lacking ARIA labels, and custom checkbox buttons missing `role` and `aria-checked` attributes, rendering them inaccessible to screen readers.
**Action:** Add comprehensive ARIA attributes (`aria-label`, `role="checkbox"`, `aria-checked`) to all icon-only buttons and custom list interactions to ensure correct semantic meaning and accessibility.
