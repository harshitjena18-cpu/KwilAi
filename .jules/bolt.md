
## 2026-06-15 - Unnecessary Populates with Virtuals
**Learning:** Mongoose virtual properties (like fullProfile) can implicitly discard data from expensive .populate() calls if the fields aren't explicitly mapped in the virtual definition. In addition, .populate() is often unnecessary when only the array length of referenced documents is needed.
**Action:** Always verify that populated data is actually used in the final response payload, especially when virtual properties handle the serialization, and avoid populating document arrays just to count them.
