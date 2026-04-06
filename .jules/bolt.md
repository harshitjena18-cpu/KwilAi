## 2024-04-06 - Batching MongoDB Inserts
**Learning:** Using insertMany bypasses Mongoose pre('save') hooks.
**Action:** Verify the target model does not rely on save hooks before optimization.
