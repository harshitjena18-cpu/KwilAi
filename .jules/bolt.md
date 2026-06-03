## 2026-06-03 - Unnecessary Mongoose Populate
**Learning:** In Mongoose, document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Populating these fields when only the length is needed (e.g., `user.savedRecipes?.length`) or when the result is discarded by virtuals (e.g., `user.fullProfile`) causes expensive and unnecessary database joins.
**Action:** Always verify that populated fields are actually used in the response payload and avoid `.populate()` if only the array length is required.
