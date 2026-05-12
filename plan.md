1.  **Add `aria-label` to icon-only buttons in `KwilShoppingList.tsx`:**
    *   Line 95: "Go back" (ArrowLeft)
    *   Line 108: "Share shopping list" (Share2)
    *   Line 118: "Download shopping list" (Download)
    *   Line 221: "Confirm add item" (Check)
    *   Line 296: "Toggle item"
    *   Line 343: "Delete item"
2.  **Add `focus-visible` styles to interactive elements in `KwilShoppingList.tsx` for keyboard accessibility:**
    *   Add `focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF9C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B08]` to all `<button>` elements.
    *   For the delete button, specifically add `focus-visible:opacity-100` so it appears on focus even without hover.
3.  **Ensure `group` class is present for `group-hover:opacity-100`:**
    *   In the list item container, ensure `group` class is added so the delete button's hover state works properly.
4.  **Verify changes locally:**
    *   Use `read_file` to review modifications.
    *   Run UI dev server to verify visually (`frontend_verification_instructions`).
5.  **Run Pre-commit checks:**
    *   Execute any required linting or tests.
6.  **Update `.Jules/palette.md`:**
    *   Log learning about adding `focus-visible` to hover-only action buttons.
