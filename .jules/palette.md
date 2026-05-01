## 2026-05-01 - Fix hover visibility and keyboard accessibility
**Learning:** When using `group-hover:opacity-100` for elements like delete buttons, the parent container must have the `group` class, and the button itself must include `focus-visible:opacity-100` to ensure keyboard users can discover and interact with it.
**Action:** Always verify parent classes for group-hover interactions and explicitly add focus-visible visibility utilities for keyboard accessibility on hover-only elements.
