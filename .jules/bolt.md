## 2026-08-14 - Unnecessary Mongoose populate calls
**Learning:** Mongoose virtual properties or array length checks don't need fully populated reference arrays. An unpopulated array of ObjectId references inherently retains its correct `.length` property. Furthermore, populating fields that are subsequently omitted by virtuals causes expensive and redundant database joins.
**Action:** Always verify if populated data is actually used in the response, especially when only the array length is needed or when the data is passed through a virtual.
