## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2024-03-24 - ReDoS via MongoDB Regex Search
**Vulnerability:** The application was passing unsanitized user inputs into MongoDB $regex queries and RegExp constructors, making it vulnerable to Regular Expression Denial of Service (ReDoS).
**Learning:** User inputs passed into dynamic regular expressions or MongoDB $regex operators must be sanitized because malicious payloads can cause exponential matching time, leading to Denial of Service (DoS) and NoSQL injection vulnerabilities.
**Prevention:** Always use a utility function like escapeRegExp to sanitize user inputs by escaping special regex characters before applying them to dynamic regex operations.
