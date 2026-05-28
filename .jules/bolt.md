## 2024-05-28 - Avoid unnecessary .populate() in Mongoose
**Learning:** In Mongoose, document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Avoid using .populate() if an endpoint only requires the array length (e.g., user.savedRecipes?.length), as this prevents expensive and unnecessary database joins.
**Action:** Remove .populate() in Mongoose queries when only the array length is needed.
