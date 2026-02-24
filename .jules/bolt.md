## 2024-05-22 - [Optimizing Mongoose Bulk Writes]
**Learning:** Mongoose `bulkWrite` bypasses schema validation, defaults, and timestamps (`createdAt`, `updatedAt`). To safely use it for performance, one must manually instantiate the model (`new Model(data)`), validate it (`validateSync()`), apply defaults (`toObject()`), and explicitly set timestamps before constructing the bulk operations.
**Action:** When replacing `create`/`save` loops with `bulkWrite`, always manually handle validation and timestamps to maintain data integrity.
