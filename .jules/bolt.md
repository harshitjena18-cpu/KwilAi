
## 2026-04-03 - Batching Database Insertions in Loops
**Learning:** Sequential Mongoose `Model.create()` calls inside a loop introduce an N+1 query problem that significantly delays response times for batch operations. Using `Model.insertMany()` reduces multiple roundtrips to exactly one, optimizing database interaction for loops handling batches of objects.
**Action:** When adding array processing logic or bulk creation endpoints, always collect objects into an array and use `insertMany()` at the end instead of sequential `create()` calls inside the loop.
