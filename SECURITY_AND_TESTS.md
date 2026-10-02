# Validation and operational notes

The local HTTP integration tests passed for:

- Anonymous users denied access to the page, catalogue, scripts and source files.
- Pending/rejected users denied app assets.
- Discord OAuth state bound to a browser cookie, expiration and one-use storage; replay rejected.
- Verified immutable Discord IDs, with no username-based allowlist.
- Per-user email throttling and fail-closed handling when email fails.
- Email-review GET does not approve; deliberate same-origin POST required.
- Invalid/expired/replayed approval links rejected; atomic pending-state decisions.
- Approved users can retrieve the original app and catalogue.
- CSRF-protected logout and owner actions.
- Revocation immediately denies subsequent requests from an existing session.
- Database outages and missing configuration leave access closed.

Tests exercise real local Express HTTP routes with mock Discord, mail and Redis adapters. Live Discord sign-in, delivery to your mailbox, hosted Redis commands and Vercel bundling cannot be verified until you configure those services and deploy. Follow the live test checklist in SETUP.md before granting access to real users.

The app sets no-store headers for browsers and Vercel caches, uses opaque server-side sessions, signed expiring approval capabilities, a fixed trusted deployment origin, CSP/frame restrictions and allowlisted asset paths. Secrets are server environment variables. Provider calls time out and fail closed. Discord access/refresh tokens are not persisted.

An emailed approval link is a bearer authorization capability for one pending user. It expires in 72 hours and requires a confirmation POST. Protect the mailbox and do not forward approval links. Optional owner IDs may bypass approval because the operator explicitly authorizes them in the environment.

Revocation prevents future server access; it cannot erase assets/data an approved person already downloaded or prevent copying of client-side app code. Previous unprotected deployments must be removed or restricted separately.

A missing or unavailable email/database configuration is not replaced with an insecure static fallback. Files under protected/ are bundled into the server; do not move them into public/ or configure a static deployment output.
