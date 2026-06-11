## 2026-06-11 - Derived State Re-rendering
**Learning:** In controlled inputs, derived array iterations inside the render body run on every keystroke, causing unnecessary overhead.
**Action:** Always wrap derived state calculations like filtering and map loops in `useMemo`.
