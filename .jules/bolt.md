## 2026-04-25 - Unnecessary Mongoose Populations
**Learning:** In the backend architecture, Mongoose `.populate()` is sometimes used indiscriminately before returning DTOs or virtuals (like `fullProfile`) that discard the populated data, or just to get an array's `.length` for statistics. This creates hidden N+1 queries and memory spikes.
**Action:** Always verify if populated fields are actually utilized in the final response payload or computation. When only the count of relationships is needed, evaluate the unpopulated ObjectId array length directly.
