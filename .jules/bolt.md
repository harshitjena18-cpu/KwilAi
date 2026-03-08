## 2024-03-08 - Use insertMany() for Batch DB Operations to Prevent N+1 Queries
**Learning:** Sequential `Model.create()` calls inside loops are a performance anti-pattern that results in an N+1 query problem, increasing network overhead and latency. In batch ingredient additions, scanning and adding items line-by-line triggers numerous slow DB calls.
**Action:** When adding arrays of documents, map them into a single array and use `Model.insertMany(docs)` to reduce database round-trips from N to 1.
