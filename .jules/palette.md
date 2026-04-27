## 2024-05-18 - Missing ARIA labels on Icon-only buttons
**Learning:** Found several icon-only interactive elements in components like `KwilShoppingList` and `UpgradePage` that were lacking explicit accessibility labels (`aria-label`).
**Action:** When adding icon-only buttons (`<button>`, `<motion.button>`) anywhere in the application, verify that an `aria-label` or visual hidden text is provided for screen readers, since an icon alone provides no context.
