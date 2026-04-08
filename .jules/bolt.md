## 2026-04-08 - Optimize batch insertion
**Learning:** Sequential `Model.create()` loops are a performance bottleneck leading to unnecessary N+1 database roundtrips. Using `Model.insertMany()` reduces multiple database calls to a single call and preserves array-based downstream logic.
**Action:** Use `insertMany()` for operations where multiple items are added at once to improve performance.
