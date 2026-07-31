## 2024-05-24 - Unnecessary Mongoose Populations
**Learning:** In Mongoose, unpopulated arrays of ObjectId references inherently retain their correct `.length` property. Furthermore, populated fields that are omitted by virtuals like `.fullProfile` result in expensive and redundant database joins.
**Action:** Avoid calling `.populate()` when only the length of a reference array is needed, or when the populated data is not actually used in the response payload.
