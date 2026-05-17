## 2026-05-17 - Replaced iterative Pantry.create with insertMany for batch operations
**Learning:** In Mongoose controllers, iterative `.create()` calls within loops create an N+1 database query pattern which causes performance degradation for bulk insert operations.
**Action:** Always replace iterative `.create()` calls with `.insertMany()` for batch data operations to eliminate N+1 query patterns and improve database performance.
