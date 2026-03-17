## 2024-05-21 - Custom Switch Accessibility
**Learning:** Custom switch components implemented as <button> elements often miss the role="switch" and aria-checked attributes, making them confusing for screen reader users who just hear "Button".
**Action:** Always verify custom interactive elements against WAI-ARIA patterns. For switches, ensure role="switch" and aria-checked are present. Also, ensure external labels are associated via aria-label or aria-labelledby.

## 2024-05-22 - Custom Interactive Divs Accessibility
**Learning:** Custom interactive elements (like chips) built with \`div\` tags often miss native keyboard access and screen reader support when an \`onClick\` handler is added. Nested icon-only buttons (like remove buttons) also need descriptive labels.
**Action:** Always add \`role="button"\`, \`tabIndex={0}\`, \`onKeyDown\` (handling Enter and Space), and \`focus-visible\` styles to \`div\`s with \`onClick\` handlers. Ensure nested icon buttons have descriptive \`aria-label\`s (e.g., \`Remove \${itemName}\`).
