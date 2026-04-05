## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2026-04-05 - Prevent ReDoS via Escape RegExp
**Vulnerability:** Unsanitized user inputs passed directly to MongoDB \`$regex\` operators or \`new RegExp()\` constructors allowed for Regular Expression Denial of Service (ReDoS).
**Learning:** Express validation does not sanitize strings against regex special characters, allowing ReDoS vulnerabilities or NoSQL injections.
**Prevention:** Create and use an \`escapeRegExp\` utility to sanitize any user-controlled input prior to using it in dynamic regular expressions.
