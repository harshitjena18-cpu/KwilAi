## 2026-02-23 - Avoid Expensive Derivations on Unrelated State Changes
**Learning:** In React, placing O(N*C) computations (like mapping over categories and filtering lists) directly in the component body means they recalculate on *every* keystroke if there's a controlled text input in the same component, blocking the main thread and causing input lag.
**Action:** Always memoize expensive array operations that derive state (`groupedItems`, `progress`) using `useMemo` and ensure static arrays (`CATEGORIES`) are declared outside the component to prevent redundant memory allocation.
