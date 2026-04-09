## 2026-04-09 - AI Batch Insertion Anti-Pattern
**Learning:** The application frequently processes AI vision and voice responses as arrays, which leads to anti-patterns where items are inserted into the database in sequential `Model.create()` loops, creating N+1 query bottlenecks.
**Action:** When saving batched AI data, use `.map()` to build an array of documents and insert them simultaneously with `Model.insertMany()` to reduce database roundtrips from O(n) to O(1).
