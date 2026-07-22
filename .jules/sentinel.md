## 2024-03-24 - DoS via Parameter Type Confusion in Express Query Parser
**Vulnerability:** The `getSuggestions` endpoint crashed when `ingredients` query parameter was passed as an object (e.g., `?ingredients[foo]=bar`). The code assumed `ingredients` was a string or array of strings, but `express` query parser (via `qs`) parses `ingredients[foo]=bar` as `{ ingredients: { foo: 'bar' } }`. This caused `ingredients.split(',')` to throw `TypeError: ingredients.split is not a function`, leading to a 500 error and potential DoS if abused.
**Learning:** Express `req.query` parsing is flexible and can return Objects where Strings are expected. `mongoSanitize` middleware only removes `$` and `.` keys but does not validate types. Input validation libraries like `express-validator` are essential not just for data format, but for strict type enforcement to prevent Type Confusion attacks.
**Prevention:** Always validate the TYPE of input parameters before using them. Use `express-validator`'s `isString()` or custom validators to ensure query parameters are of the expected type.
## 2025-02-23 - Added registerLimiter
**Vulnerability:** Missing rate limiter on the register route causing a server crash on startup; missing secure and sameSite flags on logout token cookie.
**Learning:** Unused imports can crash Node apps; cookies set without secure flags leave users vulnerable to CSRF and session hijacking on logout.
**Prevention:** Ensure rate limits are fully defined before importing them in routes. Make sure logout resets use the same secure/sameSite flags as login cookies.
