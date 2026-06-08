## 2026-06-08 - Unnecessary Mongoose populate() usage
**Learning:** Mongoose document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Populating is unnecessary if only the array length is needed, and is wasted work if the populated field is discarded by virtuals (e.g., `fullProfile`).
**Action:** Always verify that populated fields are actually used in the response payload and avoid using `.populate()` if only the array length is needed to prevent expensive database joins.
