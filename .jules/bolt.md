## 2026-10-03 - Optimize batch pantry insertions
**Learning:** Using Mongoose `insertMany` for bulk database operations avoids the N+1 query problem, which is especially important in array-based operations like ingredient scanning.
**Action:** Always look for opportunities to replace loops containing database write operations with single bulk operations when working with array data structures.
