## 2024-05-06 - Memory & DB overhead from unused Mongoose .populate()
**Learning:** The getProfile and getUserStats endpoints were fetching fully populated referenced documents ('savedRecipes') only to immediately discard the populated data or just check the .length of the array. This creates significant memory and JSON serialization overhead and introduces N+1 query patterns for no reason.
**Action:** Always avoid using .populate() on reference arrays if only checking array length or if the populated fields are not utilized in the final response DTO/virtual.
