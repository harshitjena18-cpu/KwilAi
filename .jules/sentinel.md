## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.
## 2026-09-03 - Insecure Cookie Deletion
**Vulnerability:** Cookie cleared on logout lacked the `secure` and `sameSite` flags used during creation.
**Learning:** Modern browsers may refuse to delete a cookie if the deletion request doesn't match the original security attributes (like `secure` and `sameSite: 'strict'`), potentially leaving the auth token valid on the client after logout.
**Prevention:** Always mirror the exact security flags (httpOnly, secure, sameSite) when expiring/clearing auth cookies.
