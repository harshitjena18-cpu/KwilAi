## 2026-09-27 - Bulk Insert Optimization in controllers
**Learning:** Sequential await Model.create() in loops causes N+1 DB calls and performance degradation during batch operations.
**Action:** Use Model.insertMany() for batch insertions to perform a single DB query, significantly improving performance.
