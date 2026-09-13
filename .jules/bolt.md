## 2026-09-13 - Refactor loops with insertMany
**Learning:** Using a loop of `await Model.create()` causes an N+1 query problem on database writes, increasing latency.
**Action:** Use `Model.insertMany()` to batch inserts when bulk creating documents.
