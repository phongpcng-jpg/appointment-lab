# Authentication & Security Plan

Phase 1 does not implement authentication. The approved target architecture is short-lived stateless JWT access tokens plus opaque hashed stateful refresh sessions in Secure/HttpOnly/SameSite cookies with applicable CSRF protection.

Foundation security includes Helmet, CORS configuration, rate limiting, environment validation, request IDs and safe error responses. Secrets are supplied through environment variables and `.env` is ignored.
