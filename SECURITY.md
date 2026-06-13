# Security Policy

CarbonWise is a static, client-side awareness app. It does not collect accounts, passwords, payment data, personal identifiers, or server-side user records.

## Data Handling

- Lifestyle inputs are stored only in the user's browser with `localStorage`.
- Stored values are sanitized before use.
- The app does not send user-entered lifestyle data to a backend.
- The app does not use analytics, cookies, or third-party scripts.

## Server Hardening

The production server is intentionally small and serves only known public static files.

- Allowed methods: `GET`, `HEAD`
- Blocked methods return `405 Method Not Allowed`
- Non-public files return `403 Forbidden`
- Malformed encoded paths return `400 Bad Request`
- Oversized URLs return `414 URI Too Long`
- Path traversal is blocked by resolving paths against the static root

## Response Headers

The server sets defense-in-depth headers:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`

## Reporting Issues

For this hackathon project, security issues can be reported through the GitHub repository owner.
