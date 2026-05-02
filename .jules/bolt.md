## 2026-03-01 - Avoid Unnecessary Mongoose .populate() Calls
**Learning:** Found an anti-pattern in `userController.js` where `User.findById().populate('savedRecipes')` is called, but the populated data is entirely discarded by a virtual (`fullProfile`) or only used to check array length (`savedRecipes.length`). This causes N+1 query problems and significant memory overhead for no reason.
**Action:** Always verify that `.populate()` results are actually utilized in the final response payload. Calculate unpopulated ObjectId array lengths directly.
