## 2024-06-19 - Unnecessary Mongoose Populations
**Learning:** Mongoose document arrays maintain their length property even when unpopulated because they hold arrays of ObjectIds. Also, populated fields might be discarded if the response payload uses virtuals (like fullProfile) that don't include them.
**Action:** Avoid using .populate() if an endpoint only requires the array length or if the populated data is discarded before the response is sent to prevent expensive and unnecessary database joins.
