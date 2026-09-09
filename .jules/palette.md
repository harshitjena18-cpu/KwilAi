## 2024-03-20 - Adding focus-visible to hover-only actions
**Learning:** When making hover-only actions (like delete buttons that appear on row hover) keyboard accessible, simply adding outline/ring styles isn't enough because the element remains hidden (opacity-0). We must explicitly add `focus-visible:opacity-100` so keyboard users can actually see the focused element.
**Action:** Always pair focus indicators with visibility resets (`focus-visible:opacity-100` or equivalent) when adding keyboard support to conditionally hidden UI elements.
