## 2024-05-24 - Unnecessary populate() causing performance issues
**Learning:** In Mongoose models where we only need the length of an array field containing `ObjectIds` (like `savedRecipes`), doing a `.populate()` first adds unnecessary overhead and an expensive database `$lookup`. We observed this in `userController.js` inside `getUserStats`.
**Action:** When only retrieving the count or length of an array of ObjectIds, simply query the base document and do not call `.populate()` on the field.
