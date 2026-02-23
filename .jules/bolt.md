## 2025-02-18 - Mongoose BulkWrite Validation
**Learning:** Mongoose `bulkWrite` operations bypass schema validation middleware and `save()` hooks.
**Action:** Always manually validate documents using `new Model(data).validate()` before adding them to `bulkWrite` operations to ensure data integrity without sacrificing performance.
