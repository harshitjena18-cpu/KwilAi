## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2026-05-09 - Prevent NoSQL Injection in Mongoose Regex Queries
**Vulnerability:** User input directly injected into `$regex` and `new RegExp()` queries bypassing `express-mongo-sanitize`.
**Learning:** `express-mongo-sanitize` does not sanitize string values within regex operators. Always explicitly escape inputs used in regular expressions to prevent ReDoS and logic manipulation.
**Prevention:** Use a dedicated `escapeRegExp` utility function to sanitize strings before constructing regular expressions in Mongoose.
