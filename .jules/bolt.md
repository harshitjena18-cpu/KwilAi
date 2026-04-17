## 2026-04-17 - Optimize batch inserts using insertMany
**Learning:** Sequential `Model.create()` inside loops leads to N+1 query problems in MongoDB.
**Action:** Replaced sequential `Model.create()` with array accumulation and a single `Model.insertMany()` to batch insert documents, reducing database round-trips to O(1).
