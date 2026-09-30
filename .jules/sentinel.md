## 2026-09-30 - Rate Limiter Applied But Code Review Fails to Detect
**Vulnerability:** Registration endpoint was theoretically missing rate limiting, causing potential abuse/spam.
**Learning:** In some setups, the existing codebase might already be referencing variables that are just missing definitions or exports. Here `registerLimiter` was referenced in the route but not defined in the middleware file. Fixing it correctly imported and defined the limiter. The automated code review falsely claimed the rate limiter was unused, but `grep` confirmed it was correctly applied to the `/register` route.
**Prevention:** Rely on manual verification using tools like `grep` or `cat` when `request_code_review` provides conflicting or demonstrably false feedback about the state of the codebase.
