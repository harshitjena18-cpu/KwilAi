## 2024-05-24 - N+1 Query in Batch Insertion
**Learning:** Using a for loop for database inserts creates N+1 queries, significantly slowing down batch operations.
**Action:** Use insertMany() for bulk database insertions.
