## 2026-06-05 - Unnecessary Mongoose Populates
**Learning:** In Mongoose, document arrays maintain their `length` property even when unpopulated because they hold arrays of ObjectIds. Furthermore, virtuals (like `fullProfile`) may discard populated fields if not explicitly mapped.
**Action:** Avoid using `.populate()` if an endpoint only requires the array length (e.g., `user.savedRecipes?.length`), and always verify that populated fields are actually used in the response payload to prevent expensive and unnecessary database joins.
