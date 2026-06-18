## 2024-06-18 - Unnecessary Mongoose Populate Overheads
**Learning:** In Mongoose, array fields contain ObjectIds even when unpopulated, meaning `.length` can be accessed without a costly `.populate()` join. Additionally, populated data is often fetched only to be completely discarded by virtual properties (like `fullProfile`) in the final response payload.
**Action:** Always verify if an endpoint only needs the array length or if the populated fields are actually used in the response payload before adding `.populate()`, to prevent expensive and unnecessary database joins.
