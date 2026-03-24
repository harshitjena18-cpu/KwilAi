## 2026-03-24 - Mongoose Read Optimization
**Learning:** Mongoose document hydration creates significant overhead for read-only operations like fetching a user profile. Using `.lean()` returns plain JavaScript objects, improving performance, but it strips virtuals and instance methods.
**Action:** Use `.lean()` for read-only queries and implement static mapping methods (like `User.toFullProfile`) to reconstruct the expected response payload without the hydration overhead.
