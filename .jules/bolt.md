
## 2024-03-09 - [Avoid Loading Full Mongoose Documents For Counting]
**Learning:** Using `this.find()` and then `.length` loads entire documents into memory. This can be problematic and lead to high memory use if there are thousands of matches.
**Action:** Use `this.countDocuments()` when only the total count of matches is needed, avoiding unnecessary DB payloads and memory overhead.
