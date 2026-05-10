## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.
## 2024-05-24 - [Keyboard Focus in Custom List Items]
**Learning:** When using custom `group-hover` visibility for actions like delete buttons in list items, keyboard navigators are completely locked out unless the parent explicitly has the `group` class AND the button explicitly includes `focus-visible:opacity-100`. Without both, the button cannot be triggered or seen via tab navigation.
**Action:** Always verify hover-only UI patterns with keyboard navigation and apply `focus-visible:opacity-100` alongside full Tailwind focus utilities (`focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`).
