## 2026-06-02 - Unnecessary Mongoose Populates
**Learning:** Document arrays maintain their length property even when unpopulated. Using .populate() when only the array length is needed, or when populated fields are discarded by virtuals like fullProfile, causes expensive database joins.
**Action:** Always verify that populated fields are actually used in the response payload.
