## 2024-05-29 - Unnecessary Database Joins via Mongoose Populate
**Learning:** Mongoose document arrays maintain their `length` property even when unpopulated, and endpoints like `getProfile` may mistakenly populate fields that are later discarded by response virtuals (like `fullProfile`).
**Action:** Avoid `.populate()` if an endpoint only requires the array length, and always verify that populated fields are actually used in the response payload to prevent expensive and unnecessary database joins.
