## 2026-05-23 - Optimize batch operations using insertMany
**Learning:** Iterative .create() calls within loops result in N+1 queries. We can eliminate N+1 queries by replacing iterative calls with .insertMany() when we verify the schema lacks pre('save') hooks.
**Action:** Use .insertMany() instead of looping .create() for batch data operations to improve database performance.
