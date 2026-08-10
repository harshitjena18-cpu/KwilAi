## 2026-08-10 - Prevent Unnecessary Populates
**Learning:** Mongoose retains the correct `.length` for unpopulated arrays of ObjectId references. Populating fields omitted by virtuals or when only length is needed causes expensive and redundant database joins.
**Action:** Avoid invoking `.populate()` when only the array length is required or when the populated fields are omitted from the response.
