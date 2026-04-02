## 2024-05-18 - Missing escapeRegExp utility causing ReDoS vulnerability
**Vulnerability:** Regular Expression Denial of Service (ReDoS) due to unsanitized inputs passed to `new RegExp()` and MongoDB `$regex`.
**Learning:** `new RegExp()` in user-controlled inputs allows for ReDoS and parameter injection.
**Prevention:** Always sanitize strings passed into regex constructions via an `escapeRegExp` utility function, and validate the input types to prevent DoS via Express Parameter Type Confusion.
