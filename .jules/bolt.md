## 2026-05-19 - Eliminate N+1 insert queries in Mongoose controllers
**Learning:** Iterative Mongoose `.create()` calls inside loops cause serious N+1 database performance bottlenecks during batch additions (e.g. bulk pantry inserts).
**Action:** Always replace `.create()` inside loops with a single `.insertMany()` call for bulk data array insertions to optimize database latency.
