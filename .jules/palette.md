## 2026-04-30 - Hidden Secondary Actions in Kwil Components
**Learning:** The application uses `opacity-0 group-hover:opacity-100` for secondary actions like delete buttons across list items. This pattern completely hides critical actions from keyboard-only users who cannot hover.
**Action:** Whenever using the `group-hover:opacity-100` pattern in Kwil's lists, strictly append `focus-visible:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color]` to ensure keyboard navigability.
