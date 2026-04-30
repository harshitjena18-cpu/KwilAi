## 2026-34-30 - Unnecessary Populates in User Profile & Stats
**Learning:** Mongoose  is heavily overused, fetching full document arrays unnecessarily just to calculate `.length` or to populate fields that are later completely discarded by virtual getters like `fullProfile`.
**Action:** Always check if populated fields are actually utilized in the final response payload, and calculate unpopulated ObjectId array lengths directly instead of executing full document array queries.
## 2026-04-30 - Unnecessary Populates in User Profile & Stats
**Learning:** Mongoose `.populate()` is heavily overused, fetching full document arrays unnecessarily just to calculate `.length` or to populate fields that are later completely discarded by virtual getters like `fullProfile`.
**Action:** Always check if populated fields are actually utilized in the final response payload, and calculate unpopulated ObjectId array lengths directly instead of executing full document array queries.
