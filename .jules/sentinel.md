## 2026-06-07 - Missing Rate Limiting on User Registration
**Vulnerability:** Registration endpoint did not have rate limiting, making it susceptible to spam accounts or brute-forcing registration.
**Learning:** Security middleware for registration was missing from the route definitions. Need to ensure rate limiters exist on high-impact public endpoints to prevent abuse.
**Prevention:** Apply rate limiting to all public-facing account creation routes in addition to login endpoints.
