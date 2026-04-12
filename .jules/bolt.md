## 2025-04-12 - Batched Database Inserts
**Learning:** Sequential `Model.create()` inside loops creates an N+1 query problem, requiring multiple network round trips to MongoDB. Replacing these loops with `Model.insertMany()` reduces network overhead and improves API latency. `insertMany` bypasses `pre('save')` middleware, which is safe since `Pantry` does not define save hooks.
**Action:** Default to `insertMany` for bulk creation operations when no `pre('save')` hooks are present to improve API response times.
