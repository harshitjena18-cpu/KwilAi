## 2026-06-13 - Unnecessary Array Population in Mongoose
**Learning:** Mongoose document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Populating fields that are later discarded by virtuals (like fullProfile) causes expensive and unnecessary database joins.
**Action:** Avoid using .populate() if an endpoint only requires the array length or if the populated fields are not included in the final payload.
