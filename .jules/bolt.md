## 2026-05-13 - Unnecessary Mongoose Populate Calls
**Learning:** Populating reference arrays just to calculate their length or before returning DTOs that discard the data introduces unnecessary database overhead.
**Action:** Calculate unpopulated ObjectId array lengths directly and always verify populated fields are utilized.
