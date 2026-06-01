## 2026-06-01 - Unnecessary Mongoose Populate Anti-pattern
**Learning:** In Mongoose, document arrays maintain their `length` property even when unpopulated because they hold arrays of ObjectIds. Populating these arrays just to get their length, or populating fields that are later discarded by response virtuals (like `fullProfile`), results in expensive and unnecessary database joins.
**Action:** Avoid using `.populate()` if an endpoint only requires array length, and always verify that populated fields are actually used in the response payload.
