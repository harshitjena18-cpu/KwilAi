## 2026-05-24 - Memoizing Derived State
**Learning:** Derived state calculated via array methods like map/filter inside components can cause O(N*M) operations on every render.
**Action:** Always wrap heavy derived state computations in useMemo to prevent unnecessary calculations when dependencies haven't changed.
