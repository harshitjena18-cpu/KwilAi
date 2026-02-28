## 2025-02-28 - Mongoose insertMany Optimization
**Learning:** Found sequential `Pantry.create()` calls inside loops in `backend/src/controllers/pantryController.js` (`addBatchIngredients` and `scanAndAddIngredient`). This causes N+1 query problems which degrade performance linearly with the number of batch ingredients.
**Action:** Replaced sequential `Model.create()` calls with array collection and a single `Model.insertMany()` call. This pattern should be applied whenever batch inserting documents in MongoDB/Mongoose.
