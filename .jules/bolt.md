## 2024-05-18 - Replacing N+1 DB Inserts with Bulk Operations
**Learning:** Iterating over arrays and performing individual `Pantry.create` calls results in an N+1 performance bottleneck during batch insert operations (e.g., adding multiple ingredients or scanning items). Mongoose supports bulk operations which can be utilized instead.
**Action:** Replaced iterative inserts with `Pantry.insertMany()` to execute a single bulk database operation, which handles the insertion more efficiently and reduces overhead.
