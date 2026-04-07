## 2024-04-07 - Optimize bulk MongoDB operations
**Learning:** When adding multiple records in MongoDB, sequential Model.create() calls inside a loop introduce significant network overhead via N+1 queries.
**Action:** Use Model.insertMany() to batch insert arrays of documents in a single database roundtrip, significantly improving performance.
