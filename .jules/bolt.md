## 2026-08-11 - Mongoose Populate Anti-Patterns
**Learning:** The codebase has a tendency to use `.populate()` on reference arrays even when the populated data is stripped by a virtual property (e.g., `fullProfile`) or when only the array's `.length` is needed, causing expensive and redundant database joins.
**Action:** Always verify if populated fields are actually included in the API response or if only their length is needed. Unpopulated arrays of ObjectId references in Mongoose retain their correct `.length` property without requiring population.
