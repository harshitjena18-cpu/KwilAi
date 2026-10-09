## 2026-10-09 - Insecure Cookie Deletion via Missing Attributes
**Vulnerability:** The `logout` endpoint cleared the authentication cookie (`token=none`) but failed to include the `secure` and `sameSite: 'strict'` flags that were present when the cookie was originally set.
**Learning:** Browsers require the `Domain`, `Path`, `Secure`, and `SameSite` attributes to match exactly when attempting to delete or overwrite a cookie. If they don't match, the deletion is ignored and the original sensitive session cookie remains active.
**Prevention:** Always mirror the exact security attributes (`secure`, `sameSite`, `path`, etc.) used during cookie creation when clearing or expiring the cookie on logout.
