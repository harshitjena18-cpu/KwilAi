## 2024-07-14 - Unmemoized Derivations Causing Input Lag
**Learning:** In React, expensive derivations (like O(N*M) filtering) inside a component body that also contains a controlled input will run on every keystroke, causing severe input lag.
**Action:** Always memoize derived data with `useMemo` and extract static constants outside components when forms/inputs trigger frequent state updates.
