## 2026-06-21 - Unnecessary Mongoose Populate
**Learning:** In Mongoose, document arrays maintain their `length` property even when unpopulated because they hold arrays of ObjectIds. Populating these fields when only the length is needed, or when the fields are discarded by virtuals like `fullProfile`, causes expensive and unnecessary database joins.
**Action:** Avoid using `.populate()` if an endpoint only requires the array length or if the populated fields are not included in the response payload.
