## 2024-05-15 - ARIA Labels on Icon-Only Buttons in Lists
**Learning:** Icon-only buttons within dynamic lists (like a shopping list) need dynamic `aria-label` attributes to maintain context. A static "Toggle" label is insufficient when there are many checkboxes.
**Action:** Always inject item context (e.g., `Toggle ${item.name}`) into `aria-label` attributes for repeated list items to ensure screen reader users know exactly which item they are interacting with.
