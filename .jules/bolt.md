## 2026-05-14 - Mongoose N+1 Queries in Controllers
**Learning:** The backend uses iterative `.create()` calls within loops for batch data operations (like adding ingredients), causing N+1 query performance bottlenecks.
**Action:** Always replace these loops with `.insertMany()` to perform a single batch database operation and improve insertion performance.
