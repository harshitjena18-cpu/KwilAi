## 2026-05-16 - Prevent N+1 Queries in Batch Inserts
**Learning:** Iterative database inserts inside a loop (e.g., `Pantry.create` in `addBatchIngredients`) trigger an N+1 query pattern, increasing latency and database overhead. It is critical to accumulate records into an array and use `insertMany()` to batch operations into a single network call.
**Action:** Always scan loops containing database operations. For insertions, collect the document payloads and use `Model.insertMany()` instead of `Model.create()` inside the loop.
