## 2026-09-08 - Bulk Insert Optimization in Batch Endpoints
**Learning:** Found an N+1 database roundtrip anti-pattern in the batch creation endpoint (addBatchIngredients), where individual Pantry.create() operations were executed in a loop.
**Action:** Always use Model.insertMany() for endpoints handling array payloads to reduce network overhead and ensure fast API response times.
