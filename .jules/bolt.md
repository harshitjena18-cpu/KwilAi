## 2024-06-10 - Avoid populating arrays for length checks
**Learning:** In Mongoose, array fields contain the length even when unpopulated (as they hold ObjectIds). Using `.populate()` when only the length is needed (e.g. `user.savedRecipes?.length`) creates unnecessary and expensive database joins, slowing down endpoints like `/api/users/stats`.
**Action:** Always check if a populated field is actually used in the response payload. If only the length is needed, omit `.populate()` entirely.
