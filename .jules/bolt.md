## 2024-05-30 - Unnecessary Mongoose Populates
**Learning:** Virtual getters (like `fullProfile`) can discard fields fetched via expensive `.populate()` calls, and Mongoose arrays of ObjectIds maintain their `length` property even without population.
**Action:** Always verify that populated fields are actually used in the final response payload or required for logic, especially before array length checks or when returning virtuals.
