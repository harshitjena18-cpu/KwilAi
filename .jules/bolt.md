## 2026-07-28 - Unnecessary DB Joins
**Learning:** Mongoose unpopulated ObjectId arrays retain their length property. Also, populating fields that are later omitted by virtuals like fullProfile causes expensive redundant DB joins.
**Action:** Only populate fields when the nested object data is actually utilized.
