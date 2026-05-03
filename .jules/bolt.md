
## 2026-05-03 - Unnecessary Mongoose populate()
**Learning:** In Mongoose, using `.populate()` on reference arrays just to evaluate their `.length` for statistics, or before returning virtuals that discard the populated data, introduces significant database and memory overhead.
**Action:** Calculate unpopulated ObjectId array lengths directly and always verify populated fields are actually utilized in the final response payload.
