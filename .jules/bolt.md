## 2026-05-11 - Unnecessary Mongoose population
**Learning:** Mongoose `.populate()` is often used blindly before returning DTOs or virtuals that discard the populated data. Additionally, evaluating `.length` on reference arrays for statistics does not require population.
**Action:** Calculate unpopulated ObjectId array lengths directly, and always verify populated fields are actually utilized in the final response payload.
