## 2026-06-20 - Unused Mongoose Population
**Learning:** Mongoose virtuals like fullProfile may discard fields that were explicitly and expensively populated.
**Action:** Always verify that populated fields are actually used in the response payload (rather than discarded by virtuals like fullProfile) to prevent expensive and unnecessary database joins.
