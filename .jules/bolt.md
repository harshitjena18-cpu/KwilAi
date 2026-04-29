## 2024-04-29 - Unnecessary MongoDB Document Population
**Learning:** Mongoose '.populate()' is extremely expensive. Using it just to evaluate an array's '.length' or before mapping to a DTO/virtual that discards the populated fields introduces severe database query and memory overheads without any benefit. The length of an unpopulated ObjectId reference array can be evaluated directly.
**Action:** Always verify that populated fields are actually utilized in the final response payload before adding '.populate()'.
