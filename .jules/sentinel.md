## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2024-05-24 - Prevent ReDoS and NoSQL Injection via RegExp Sanitize
**Vulnerability:** User-controlled input was passed unescaped directly into `$regex` and `new RegExp()`, leading to potential ReDoS and NoSQL injection vulnerabilities.
**Learning:** Using regex dynamically from user input always requires escaping special characters. Further, we must perform a `typeof string === 'string'` check to prevent Express Parameter Type Confusion.
**Prevention:** Ensure the `escapeRegExp` utility is used on any dynamic string before using it within a RegExp object or `$regex` MongoDB query.
