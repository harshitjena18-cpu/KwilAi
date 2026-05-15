## 2026-05-15 - Optimize Mongoose bulk insertions
**Learning:** Iterative Mongoose `create()` calls inside `for...of` loops create an N+1 query pattern, which drastically slows down performance during bulk additions such as batch ingredient uploads.
**Action:** Use Mongoose's `insertMany()` function whenever adding multiple documents at once to reduce database round-trips from N to 1.
