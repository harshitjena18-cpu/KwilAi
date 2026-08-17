## 2024-08-17 - Prevent Unnecessary Joins by Removing Redundant Populates
**Learning:** In Mongoose, populating reference arrays (e.g., `savedRecipes`) when only the array length or raw ObjectId values are needed causes expensive and redundant database joins, negatively impacting performance.
**Action:** Always verify if populated fields are actually consumed by the application logic. If only the length or ID is required, remove the `.populate()` call to avoid unnecessary N+1 query patterns and database load.
