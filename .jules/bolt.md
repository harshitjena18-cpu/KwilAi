## 2026-05-25 - Unused Mongoose Populates cause Silent Bottlenecks
**Learning:** Mongoose `.populate()` calls can be silently discarded by DTOs or virtuals (like `fullProfile`), causing expensive database joins that provide zero value to the client.
**Action:** Always verify that populated fields are actually used in the final response payload, and avoid populating documents if only the array length is needed.
