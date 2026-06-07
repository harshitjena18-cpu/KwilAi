## 2026-06-07 - Unnecessary Mongoose Populate
**Learning:** In Mongoose, document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Populating these arrays or populating fields that are eventually discarded by virtuals causes expensive and unnecessary database joins.
**Action:** Avoid using .populate() if an endpoint only requires the array length, and always verify that populated fields are actually used in the response payload.
