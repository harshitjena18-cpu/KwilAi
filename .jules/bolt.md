## 2024-08-07 - Prevent O(N*M) calculation on every keystroke in KwilShoppingList
**Learning:** In KwilShoppingList, typing in the 'Add Item' input updates the state (setNewItem) on every keystroke, which re-rendered the component and ran a non-memoized array map and filter operation over all shopping list items for all 5 categories (O(N*M)). This causes typing to become sluggish as the list grows.
**Action:** Always wrap expensive list grouping/filtering operations in `useMemo` to cache the result, especially when the component contains frequently-updating state like text inputs.
