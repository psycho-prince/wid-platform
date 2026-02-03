# WID Platform Security

This document outlines the security model, threat landscape, trust boundaries, and key management notes for the When I Die (WID) platform.

## Core Security Principles

-   **Zero Trust**: No user, service, or network is trusted by default. All access is authenticated, authorized, and encrypted.
-   **Least Privilege**: Components are granted only the minimum permissions necessary to perform their function.
-   **Defense in Depth**: Security controls are layered to protect against a wide range of attacks.
-   **Secure by Design**: Security is a primary consideration in all architectural and implementation decisions.
-   **Complete Mediation**: Every single request to access a resource must be fully authenticated and authorized.
-   **Auditability**: All significant actions and decisions are immutably logged for forensic analysis and legal defensibility.

## Threat Assumptions

The following assumptions are made regarding the operating environment and attacker capabilities:
-   **Malicious Actors**: Assume existence of internal (rogue employees, compromised credentials) and external (hackers, nation-states) malicious actors.
-   **Network Compromise**: Assume network segments can be breached, necessitating encryption and authentication for all communications, even internal.
-   **Client-Side Vulnerabilities**: Frontend applications are inherently untrusted and vulnerable to client-side attacks (XSS, CSRF). All validation and authorization must occur on the server-side.
-   **Third-Party Dependencies**: Assume third-party libraries and services may contain vulnerabilities. Regular scanning and updates are required.
-   **Physical Security**: Assume underlying infrastructure (cloud provider data centers) has adequate physical security.

## Trust Boundaries

Clearly defining trust boundaries helps to understand where security controls are most critical.

-   **External to API Gateway**: Untrusted. All traffic is authenticated (JWT) and subject to rate limiting and input validation.
-   **API Gateway to Internal Services**: Zero-Trust boundary.
    -   API Gateway acts as the trust anchor for external JWTs.
    -   Internal requests from Gateway to services are signed using HMAC (`X-Internal-Signature`, `X-Internal-Timestamp`).
    -   User identity extracted from JWT is forwarded via signed headers (`X-User-Id`, `X-User-Email`).
    -   Internal services explicitly verify HMAC signatures and reject unsigned/invalid requests.
    -   Frontend JWTs are **never** trusted by internal services directly.
-   **Internal Services to Database/Redis**: Protected boundary.
    -   Each service has dedicated database credentials with least privilege.
    -   Communication occurs over a private network (Docker bridge).
-   **Client-Side (Frontend)**: Untrusted. All data originated from the client is validated and sanitized on the server. No secrets are stored or processed on the client. User consent (e.g., terms agreement) is explicitly captured.

## Threat Model (STRIDE)

This initial threat model is based on the STRIDE framework and reflects the current MVP implementation.

### 1. Spoofing

-   **Threat**: An attacker impersonates a legitimate user, service, or external entity.
    -   *User Spoofing (External)*: Attacker uses stolen credentials or JWT to impersonate a user.
    -   *Service Spoofing (Internal)*: An attacker deploys a rogue service to intercept or respond to internal traffic.
-   **Mitigation**:
    -   **User**: Strong password policies, JWT-based authentication with short-lived tokens, rate limiting on login attempts. Frontend validates user input against Zod contracts.
    -   **Service**: HMAC-based request signing for all internal service-to-service communication. Services verify `X-Internal-Signature` and `X-Internal-Timestamp` headers.

### 2. Tampering

-   **Threat**: An attacker modifies data in transit or at rest.
    -   *Data in Transit (External)*: An attacker alters API requests/responses to/from the API Gateway.
    -   *Data in Transit (Internal)*: An attacker alters internal service-to-service communication.
    -   *Data at Rest*: An attacker with database access modifies user profile data, inheritance rules, or encrypted asset metadata.
-   **Mitigation**:
    -   **External In Transit**: HTTPS for all external communication (handled by Docker/Nginx/API Gateway TLS termination). Zod validation on frontend and backend (via pipes) ensures data integrity.
    -   **Internal In Transit**: HMAC signing verifies integrity of internal requests (headers and body hash).
    -   **At Rest**: Database access is restricted and audited. All critical changes are logged in the immutable Audit Log.

### 3. Repudiation

-   **Threat**: A user or service denies performing an action (e.g., "I never set that inheritance rule").
-   **Mitigation**:
    -   **Immutable Audit Log**: Implemented a dedicated append-only audit log (`audit-service`) for all significant actions (e.g., user login, death verification status changes, asset modifications). Each log entry includes a cryptographic hash to prevent tampering.
    -   **Correlation IDs**: Generated at API Gateway and propagated through internal calls, linking all actions related to a single request.
    -   **Explicit Consent**: Frontend captures explicit user consent with timestamps for critical actions (e.g., Terms & Conditions agreement).

### 4. Information Disclosure

-   **Threat**: An attacker gains access to sensitive information.
    -   *Credential Disclosure*: Leaked passwords, JWT secrets, or API keys.
    -   *Asset Disclosure*: An attacker decrypts a user's stored digital assets.
    -   *PII Disclosure*: Leaked user profile information.
    -   *Audit Log Disclosure*: Compromise of audit log data.
-   **Mitigation**:
    -   **Zero-Trust Data Architecture**: (Future V1) Assets encrypted on client. (MVP) Server-side encryption with separate keys.
    -   **Secret Management**: All application secrets (JWT secret, DB passwords, Internal Service Secret) are managed via environment variables for local dev/MVP; will transition to a proper secrets management system (e.g., HashiCorp Vault) for production.
    -   **Least Privilege**: Services access only their own database. No direct database access from public network.
    -   **Audit Log**: Designed to be read-only with restricted access.
    -   **Error Handling**: Centralized error handling prevents sensitive information from being exposed in error responses.

### 5. Denial of Service (DoS)

-   **Threat**: An attacker makes the system unavailable to legitimate users.
    -   *Resource Exhaustion*: Overwhelming services with traffic.
-   **Mitigation**:
    -   **Rate Limiting**: Implemented at the API Gateway using `ThrottlerGuard` (10 requests per minute per IP).
    -   Container resource limits (CPU/memory) are defined in `docker-compose.yml`.

### 6. Elevation of Privilege

-   **Threat**: An attacker with limited access gains a higher level of permissions.
-   **Mitigation**:
    -   **Least Privilege**: Each service has its own database credentials and can only access the data it needs.
    -   **Service Isolation**: Services run in separate containers on a private network.
    -   **HMAC for Internal Calls**: Prevents unauthorized internal calls.
    -   **Code Quality**: Rigorous code reviews, static analysis, and dependency scanning.

## Key Management Notes (MVP)

-   **JWT Secret**: `JWT_SECRET` is used by the `auth-service` to sign JWTs and by the `api-gateway` to verify them. Currently stored in `.env.example`.
-   **Internal Service Secret**: `INTERNAL_SERVICE_SECRET` is used for HMAC signing and verification between the API Gateway and all internal services. Currently stored in `.env.example`.
-   **Database Credentials**: `DATABASE_USER`, `DATABASE_PASSWORD` are used by each service to connect to PostgreSQL. Currently stored in `.env.example`.
-   **Asset Encryption Keys**: (MVP Placeholder) For true asset encryption, a future version (V1) will implement client-side encryption and a robust key management solution (e.g., user-derived keys, KMS integration). In current MVP, `encryptedDetails` is a placeholder string.
-   **Production Key Management**: For production deployments, all secrets currently in `.env` files **must** be managed by a dedicated secrets management solution (e.g., HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager) and never hardcoded or committed to version control. Key rotation policies should be enforced.

## Security TODOs (MVP → v1)

-   [ ] **mTLS**: Implement mutual TLS for all service-to-service communication.
-   [ ] **Secrets Management**: Integrate HashiCorp Vault or a cloud provider's KMS/Secrets Manager. Remove all secrets from `.env` files for production.
-   [ ] **Database Migrations**: Use a tool like `TypeORM Migrations` or `Flyway` to manage schema changes securely.
-   [ ] **SAST/DAST/SCA**: Integrate static analysis, dynamic analysis, and software composition analysis into the CI/CD pipeline.
-   [ ] **Asset Encryption**: Implement robust client-side encryption for digital assets with secure key derivation and management.
-   [ ] **Egress Controls**: Configure strict network policies to control outbound traffic from all services.
-   [ ] **MFA**: Implement Multi-Factor Authentication for user login.
-   [ ] **RBAC/ABAC**: Implement Role-Based Access Control or Attribute-Based Access Control for fine-grained authorization.
-   [ ] **Input Sanitization**: Implement libraries for sanitizing all user inputs (e.g., `helmet` for HTTP headers, `xss` for HTML).