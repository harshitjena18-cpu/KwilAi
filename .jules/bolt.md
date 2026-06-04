## 2026-06-04 - Mongoose Populate Performance Traps
**Learning:** Mongoose document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Furthermore, populating fields that are later discarded by virtuals (like fullProfile) wastes database resources.
**Action:** Avoid using .populate() if an endpoint only requires the array length (e.g., user.savedRecipes?.length), and always verify that populated fields are actually used in the response payload to prevent expensive and unnecessary database joins.
