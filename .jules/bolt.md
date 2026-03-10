## 2025-03-10 - [Bulk Database Insert Optimization]
**Learning:** Sequential `.create()` calls inside loops lead to N+1 query problems and significantly degrade database performance when inserting multiple documents, such as adding a batch of ingredients or multiple detected items from a pantry scan.
**Action:** Use `.insertMany()` for bulk insertions to process items with a single database call, improving efficiency and reducing application latency.
