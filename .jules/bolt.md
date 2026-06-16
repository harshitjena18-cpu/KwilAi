## 2026-06-16 - Unnecessary Mongoose Populations
**Learning:** In Mongoose, document arrays maintain their `length` property even when unpopulated because they hold arrays of ObjectIds. Using `.populate()` when an endpoint only requires the array length (e.g., `user.savedRecipes?.length`) or when the populated fields are discarded by virtuals (like `fullProfile`) causes expensive and unnecessary database joins.
**Action:** Avoid using `.populate()` unless the populated fields are strictly required in the response payload. Always manually verify if populated fields are actually used.
