## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.

## 2024-07-14 - Secure cookie deletion on logout
**Vulnerability:** The logout endpoint cleared the authentication cookie without specifying the `secure` and `sameSite` attributes that were used during its creation. This could result in the browser refusing to delete the cookie, leaving the session active.
**Learning:** Cookies created with `secure` and `sameSite` flags must be explicitly deleted with the exact same flags to guarantee successful removal and maintain CSRF protection during the deletion process.
**Prevention:** Always mirror cookie creation options when clearing cookies, particularly security-related flags like `secure`, `sameSite`, and `httpOnly`.
