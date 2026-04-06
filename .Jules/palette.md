## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2026-04-06 - Nested Interactive Elements Accessibility
**Learning:** When nesting a native <button> inside a custom interactive element (like a clickable chip), the native button handles keypresses (Enter/Space) and triggers click events. To prevent the parent's keyboard handler or click handler from firing redundantly, the nested button must have an explicit onKeyDown={(e) => e.stopPropagation()}.
**Action:** Always add onKeyDown={(e) => e.stopPropagation()} to nested buttons inside custom interactive elements to prevent keypress event bubbling, and ensure the parent has role='button', tabIndex={0}, and a custom onKeyDown handler.
