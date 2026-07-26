## 2026-07-26 - Unnecessary Mongoose Populate Calls
**Learning:** In Mongoose, an unpopulated array of ObjectId references inherently retains its correct `.length` property. Invoking `.populate()` on reference arrays when only the `.length` is needed (or when the field is stripped from the response) introduces expensive and unnecessary database joins.
**Action:** Always verify if `.populate()` is strictly required. Avoid it if only the array length is accessed, or if the populated fields are omitted from the response payload.
