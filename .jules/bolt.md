## 2026-04-28 - Unnecessary Mongoose Populations
**Learning:** In Mongoose, using `.populate()` on reference arrays introduces unnecessary database and memory overhead if the populated data is later discarded by a virtual/DTO (like `fullProfile`), or if only the array length is needed (which can be calculated from the unpopulated ObjectId array).
**Action:** Before using `.populate()`, verify that the fully populated objects are actually utilized in the final response payload or logic. Avoid it when only array lengths are needed or when DTOs strip the populated fields.
