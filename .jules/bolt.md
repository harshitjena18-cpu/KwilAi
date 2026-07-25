## 2026-07-25 - Unnecessary Mongoose Population
**Learning:** In Mongoose, an unpopulated array of ObjectId references inherently retains its correct `.length` property. Do not invoke `.populate()` on reference arrays if the application logic only requires the array's length, or if the populated fields are never returned to the frontend (e.g. filtered out by a virtual).
**Action:** Always verify if populated fields are actually used in the response payload or application logic before executing expensive database joins.
