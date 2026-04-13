## 2024-04-13 - Batch Insert N+1 Query Problem
**Learning:** Sequential `Model.create()` loops in Mongoose cause N+1 query problems during batch insertions (e.g., scanning multiple ingredients at once), degrading performance linearly with the number of items. Mongoose's `insertMany` can perform this in O(1) database round-trips but bypasses `pre('save')` hooks.
**Action:** Always use `Model.insertMany()` instead of looping `Model.create()` when adding multiple documents to MongoDB, provided the target model doesn't rely on `pre('save')` middleware.
