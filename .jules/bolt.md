## 2024-06-29 - Unnecessary Mongoose Populate Calls
**Learning:** Found instances where `.populate()` was used to fetch related documents, but the result was either discarded by a virtual property (`fullProfile`) or only used for its array length. This causes expensive, unused database joins.
**Action:** Always verify if populated fields are actually exposed in the final API response or if just the ObjectId array length is sufficient before using `.populate()`.
