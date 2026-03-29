## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2024-03-29 - Prevent ReDoS in MongoDB Regex Queries
**Vulnerability:** Unsanitized user inputs were being passed directly to Mongoose $regex operators and new RegExp() constructors, exposing the application to Regular Expression Denial of Service (ReDoS) attacks.
**Learning:** The express-mongo-sanitize middleware mitigates basic object-based NoSQL injection but string inputs passed to $regex still require manual sanitization.
**Prevention:** All user-controlled inputs passed into MongoDB $regex operators or new RegExp() must be sanitized using the escapeRegExp utility located in backend/src/utils/securityUtils.js.
