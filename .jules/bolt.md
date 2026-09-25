## 2025-05-15 - N+1 query on Batch Database Inserts
**Learning:** Found an N+1 query vulnerability when iterating and calling `Model.create()` inside loops in the backend controller.
**Action:** Replaced iterative loops containing `Model.create()` with `Model.insertMany()` to execute a single bulk insertion and resolve the bottleneck.
