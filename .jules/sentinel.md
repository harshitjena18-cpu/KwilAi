## 2024-05-15 - NoSQL Injection and ReDoS via unescaped Regex

**Vulnerability:** User-controlled input in `backend/src/models/Pantry.js` and `backend/src/models/Recipe.js` was directly passed into MongoDB `$regex` operators and `new RegExp()` calls.
**Learning:** This codebase uses regex heavily for search functionality. If user input contains regex meta-characters, it can lead to Regular Expression Denial of Service (ReDoS) or NoSQL injection by bypassing intended string matching.
**Prevention:** Always sanitize user input intended for regular expressions using an escape utility function (like `escapeRegExp` in `backend/src/utils/securityUtils.js`) before using it in `$regex` or `new RegExp()`.
