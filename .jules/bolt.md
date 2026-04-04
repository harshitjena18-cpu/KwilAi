## 2024-06-05 - Optimize DB Insertions with insertMany
**Learning:** Sequential `Model.create()` loops in loops cause N+1 DB operations. `insertMany` reduces this to a single operation but bypasses `pre("save")` hooks. We verified `Pantry` has no `save` hooks.
**Action:** Use `Model.insertMany()` for bulk writes when save hooks are not required.
