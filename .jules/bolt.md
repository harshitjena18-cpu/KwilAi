## 2026-08-09 - Unnecessary Mongoose Populates
**Learning:** In Mongoose, an unpopulated array of ObjectId references inherently retains its correct `.length` property. Furthermore, populating fields that are subsequently omitted by virtuals results in expensive and redundant database joins.
**Action:** Avoid invoking `.populate()` on reference arrays if the application logic only requires the array's length or if the populated data is stripped out by a virtual or `.select()`.
