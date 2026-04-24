## 2026-04-24 - Optimize Pantry Stats Counting
**Learning:** Fetching full Mongoose documents using `.find()` just to check their `.length` causes significant memory overhead and slow JSON serialization.
**Action:** Always use database-level `.countDocuments()` aggregations instead of `.find()` when only the count is needed.
