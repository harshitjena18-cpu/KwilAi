1. **Optimize `addBatchIngredients` in `pantryController.js`**: Instead of looping through the ingredients array and making a separate database call (`await Pantry.create()`) for each item, we should map the items to an array of objects and use a single `await Pantry.insertMany()` call. This optimizes backend performance by reducing the number of round trips to the database.
2. **Optimize `scanAndAddIngredient` in `pantryController.js`**: Similarly, instead of a loop that creates one pantry item at a time, we should create an array of documents to insert and use `Pantry.insertMany()`.
3. **Add comments**: Add inline comments explaining the optimizations (e.g., `// ⚡ Bolt: Use insertMany for bulk insert to reduce database calls`).
4. **Run tests & lint**: Run `pnpm test` and `pnpm lint` in the `backend/` directory to ensure functionality is not broken.
5. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
6. **Submit PR**: Create a pull request using the exact required PR description format for Bolt optimizations.
