## 2026-10-05 - Optimize bulk pantry inserts with insertMany
**Learning:** The application uses iterative `Model.create()` loops for adding multiple ingredients in `addBatchIngredients` and `scanAndAddIngredient`. Because the `Pantry` model lacks complex save hooks, these operations are safe to optimize into a single bulk insert using `insertMany()`, reducing database calls and preventing N+1 insert performance issues.
**Action:** Always prefer `Model.insertMany()` over looping `Model.create()` when bulk inserting documents for models that don't rely on document-level middleware.
