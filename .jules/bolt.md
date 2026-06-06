## 2024-06-06 - Unnecessary Mongoose Population Optimization
**Learning:** Mongoose arrays of ObjectIds maintain their `.length` property even when unpopulated. The codebase was performing expensive database joins via `.populate()` in endpoints that either only needed the array length (like stats) or completely discarded the populated field in the response payload via virtuals (like fullProfile).
**Action:** Always verify if populated fields are actually returned in the payload, and avoid `.populate()` when only the array length is required.
