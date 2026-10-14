1. **Optimize `addBatchIngredients` and `scanAndAddIngredient` in `pantryController.js` to use bulk insertion.**
   - In `backend/src/controllers/pantryController.js`, both `addBatchIngredients` and `scanAndAddIngredient` currently iterate through lists of items and create database records one by one using `Pantry.create()` within a loop.
   - This leads to the N+1 queries problem where N items lead to N database insert queries.
   - I will refactor these endpoints to construct an array of item objects and then use `Pantry.insertMany()` to perform a single bulk insert operation.
   - Note: I must be careful not to trigger "Identifier has already been declared" if refactoring an array push. I will replace the array iteration `const pantryItems = []; for(...) { pantryItems.push(await Pantry.create(...)) }` with `const itemsToInsert = ingredients.map(...)` and `const pantryItems = await Pantry.insertMany(itemsToInsert)`.
   - Tool to use: `replace_with_git_merge_diff`.
2. **Run Backend Tests**
   - Execute `cd backend && pnpm test` to verify the refactoring doesn't break any functionality.
   - Tool to use: `run_in_bash_session`.
3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
4. **Request Code Review**
   - Request review and submit the changes with branch `bolt-pantry-bulk-insert`. The PR title will be `⚡ Bolt: Use bulk insert for pantry items`. The description will include `💡 What: Replaced looped Model.create() calls with Model.insertMany()`, `🎯 Why: To fix N+1 query problem and improve database performance during batch inserts`, `📊 Impact: Reduces database write calls from O(n) to O(1) for batch operations`, and `🔬 Measurement: Code review and unit test success`.
