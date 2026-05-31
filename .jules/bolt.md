## 2026-05-31 - Replaced sequential Mongoose create with insertMany for batch database operations
**Learning:** Running N sequential Mongoose `create()` calls inside a `for...of` loop creates an N+1 query bottleneck for database writes. Mongoose's `insertMany()` handles bulk insertions but bypasses `pre('save')` middleware hooks, which is acceptable if data validation is sufficient or no hooks exist on the schema.
**Action:** Use `insertMany()` to batch process multiple database insertions whenever the schema allows bypassing `pre('save')` hooks to significantly improve latency.
