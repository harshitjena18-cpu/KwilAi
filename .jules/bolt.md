## 2024-05-24 - Bulk DB Operations over Sequential Awaits
**Learning:** In the backend `pantryController.js`, array iterations were sequentially awaiting `Pantry.create()` in a `for...of` loop (N+1 database insert pattern).
**Action:** Replaced with `Pantry.insertMany()` to batch the database call into a single O(1) query. Always look for sequential Mongoose creates in loops and use `insertMany` to minimize network roundtrips.
