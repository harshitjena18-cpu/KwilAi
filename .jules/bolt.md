## 2024-05-24 - Bulk DB Inserts in Pantry Operations
**Learning:** The Mongoose `insertMany()` method is highly effective for reducing database round-trips from N to 1 in batch operations, but it bypasses `save()` middleware. In this application, the `Pantry` model lacks complex pre/post `save` hooks, making `insertMany()` safe and optimal for bulk database inserts without inadvertently bypassing necessary document-level middleware.
**Action:** Prioritize `insertMany()` for batch insertions where document-level middleware is absent or non-critical, replacing iterative `create()` calls.
