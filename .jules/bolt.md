## 2024-06-14 - Remove Unnecessary Mongoose Populates
**Learning:** Mongoose document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Using .populate() when only the array length is needed (or when the populated fields are subsequently discarded by a virtual property) causes expensive and unnecessary database joins.
**Action:** Avoid using .populate() if an endpoint only requires the array length (e.g., user.savedRecipes?.length), and always verify that populated fields are actually used in the response payload.
