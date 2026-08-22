## 2024-08-21 - Avoid Redundant Mongoose Population
**Learning:** Populating Mongoose document fields that are subsequently omitted by virtuals (like `fullProfile`) causes silent performance degradation. Additionally, unpopulated ObjectId arrays inherently retain their correct `.length` property, making `.populate()` unnecessary if only the count is needed.
**Action:** Always verify the fields actually consumed by virtual properties or responses before populating, and skip population for reference arrays when only the array length is required.
