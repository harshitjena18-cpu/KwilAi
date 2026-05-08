## 2024-05-24 - N+1 Queries in Bulk Endpoints
**Learning:** Backend Mongoose controllers for bulk additions (like scanning ingredients or adding batches) were previously creating documents one-by-one inside a for-loop using `.create()`. This introduces an N+1 query bottleneck.
**Action:** Always accumulate objects in an array and use `Model.insertMany()` outside the loop to execute a single database operation when inserting multiple documents at once.
