## 2026-08-13 - Unnecessary Mongoose populate calls
**Learning:** In Mongoose, an unpopulated array of ObjectId references inherently retains its correct `.length` property. Do not invoke `.populate()` on reference arrays if the application logic only requires the array's length. Also avoid populating fields that are subsequently omitted by virtuals or `.select()` to prevent expensive and redundant database joins.
**Action:** Always verify if populated fields are actually used in the response or if just the length is needed before keeping `.populate()` calls.
