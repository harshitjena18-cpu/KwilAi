## 2026-08-28 - Prevent unnecessary database population for user stats
**Learning:** Over-fetching in the backend is a common performance bottleneck. Populating entire related documents when only a count or array length is needed results in expensive N+1 queries or heavy joins and significantly increases memory overhead.
**Action:** Always verify if full object population is necessary. When only counts or reference IDs are required, rely on the base array or use projection/aggregation rather than full document hydration.
