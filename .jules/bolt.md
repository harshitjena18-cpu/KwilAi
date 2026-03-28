## 2024-05-15 - Optimize array length queries
**Learning:** In Mongoose, calling `.populate()` on an array of ObjectIds performs an expensive database join ($lookup). If only the array length is needed, `.populate()` should be omitted to reduce memory overhead and execution time.
**Action:** Remove `.populate()` when only array length is queried.
