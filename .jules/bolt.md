## 2026-07-23 - Mongoose .populate() array length optimization
**Learning:** In Mongoose, when only needing the length of an array of ObjectIds (e.g., `user.savedRecipes.length`), calling `.populate()` is unnecessary and introduces an expensive database join.
**Action:** Always check if the full documents are actually needed before calling `.populate()`, especially when just counting items.
