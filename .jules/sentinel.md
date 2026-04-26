## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2026-04-26 - ReDoS and NoSQL Injection in Mongoose regex query
**Vulnerability:** Unescaped user input was passed directly into a MongoDB `$regex` query in `Pantry.searchByName`. This allows ReDoS via complex regex payloads and NoSQL injection attacks.
**Learning:** `express-mongo-sanitize` does not sanitize values inside `$regex` or `new RegExp()`. All user-controlled string inputs used in queries must be strictly escaped using an `escapeRegExp` utility.
**Prevention:** Always escape user input before using it in a MongoDB regex query.
