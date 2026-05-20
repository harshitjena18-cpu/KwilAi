## 2026-05-20 - Replace Iterative create() with insertMany() for Batch Operations
**Learning:** Iterative `.create()` calls inside loops lead to N+1 query patterns during bulk additions. This is a common bottleneck in Mongoose controllers when handling batch data.
**Action:** Always replace iterative `.create()` calls with `.insertMany()` for bulk operations to eliminate N+1 queries and significantly improve database insertion performance.
