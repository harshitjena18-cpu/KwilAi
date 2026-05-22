## 2026-05-22 - Optimize batch inserts
**Learning:** Iterative Mongoose .create() calls inside loops lead to N+1 query patterns. However, .insertMany() bypasses pre('save') middleware, so we must first verify the schema does not rely on critical pre('save') hooks before replacing loops with .insertMany().
**Action:** Use .insertMany() for bulk inserts to optimize database performance after confirming the absence of pre('save') middleware.
