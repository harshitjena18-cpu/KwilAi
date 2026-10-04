## 2026-24-04 - [Database Insert Optimization]
**Learning:** Replacing iterative Pantry.create calls inside loops with a single Pantry.insertMany greatly reduces network roundtrips and optimizes database insertions.
**Action:** Always use insertMany for bulk insert operations instead of looping over create calls.
