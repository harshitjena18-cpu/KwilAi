## 2026-10-01 - Replaced O(N) database inserts in a loop with a single bulk insertMany for better performance
**Learning:** The classic "N+1" database insertion anti-pattern using `await Pantry.create()` inside a `for...of` loop can be heavily optimized with a single `Pantry.insertMany()` call to reduce database latency.
**Action:** Use `Model.insertMany()` when performing bulk database inserts instead of looping through individual inserts.
