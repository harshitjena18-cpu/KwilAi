## 2026-04-26 - Unnecessary Mongoose Populations
**Learning:** In the backend, Mongoose `.populate()` is sometimes called on queries where the data is either completely discarded by DTOs/virtuals (like `fullProfile`) or only the array `.length` is needed. This causes unnecessary database queries and memory overhead.
**Action:** Always verify that populated fields are actually utilized in the final response payload or calculations before calling `.populate()`.
