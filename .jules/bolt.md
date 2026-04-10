## 2024-04-10 - Replace sequential creates with insertMany
**Learning:** Replacing sequential Model.create() loops with Model.insertMany() optimizes database insertions by replacing N calls with a single batch insertion, but it bypasses Mongoose's pre('save') middleware, so we must verify the target model doesn't rely on save hooks.
**Action:** Use insertMany for bulk insertions when the target model does not rely on save hooks.
