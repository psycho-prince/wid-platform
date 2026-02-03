# WID Platform Security

This document outlines the security model, threat landscape, and risk mitigation strategies for the When I Die (WID) platform.

## Core Security Principles

- **Zero Trust**: No user, service, or network is trusted by default. All access is authenticated, authorized, and encrypted.
- **Least Privilege**: Components are granted only the minimum permissions necessary to perform their function.
- **Defense in Depth**: Security controls are layered to protect against a wide range of attacks.
- **Secure by Design**: Security is a primary consideration in all architectural and implementation decisions.
- **Complete Mediation**: Every single request to access a resource must be fully authenticated and authorized.

## Threat Model (STRIDE)

This initial threat model is based on the STRIDE framework.

### 1. Spoofing

-   **Threat**: An attacker impersonates a legitimate user, service, or external entity.
    -   *User Spoofing*: An attacker gains access to a user's account credentials.
    -   *Service Spoofing*: An attacker deploys a rogue service within the network to intercept traffic.
-   **Mitigation**:
    -   **User**: Strong password policies, mandatory MFA (v1), secure credential storage (hashing with bcrypt/argon2), JWT-based authentication with short-lived tokens.
    -   **Service**: Service-to-service authentication (e.g., mTLS) will be implemented post-MVP. All internal service communication is on a private Docker network.

### 2. Tampering

-   **Threat**: An attacker modifies data in transit or at rest.
    -   *Data in Transit*: An attacker alters API requests/responses or inter-service communication.
    -   *Data at Rest*: An attacker with database access modifies user profile data, inheritance rules, or encrypted asset metadata.
-   **Mitigation**:
    -   **In Transit**: TLS for all external communication (via API Gateway termination). Internal communication is currently within a trusted Docker network boundary, but will be secured with mTLS.
    -   **At Rest**: Database access is restricted and audited. For sensitive data (assets), tampering is mitigated by cryptographic signatures (part of the envelope encryption scheme). Any change to the encrypted blob would invalidate the signature.

### 3. Repudiation

-   **Threat**: A user denies performing an action (e.g., "I never set that inheritance rule").
-   **Mitigation**:
    -   Implement a robust, immutable audit trail for all sensitive operations (creating/modifying inheritance rules, accessing assets).
    -   Logs should be centrally collected, timestamped, and protected from tampering.
    -   For critical actions, require re-authentication or MFA confirmation.

### 4. Information Disclosure

-   **Threat**: An attacker gains access to sensitive information. This is the **most critical threat** for WID.
    -   *Credential Disclosure*: Leaked passwords, JWT secrets, or API keys.
    -   *Asset Disclosure*: An attacker decrypts a user's stored digital assets. This is the **worst-case scenario**.
    -   *PII Disclosure*: Leaked user profile information.
-   **Mitigation**:
    -   **Zero-Trust Data Architecture**: The platform **NEVER** has access to plaintext user assets. All encryption/decryption happens on the client-side in a mature implementation. For the MVP, encryption is handled server-side via envelope encryption, but the platform service **never** holds both the encrypted data and the unwrapped Data Encryption Key (DEK) simultaneously.
    -   **Envelope Encryption**: Assets are encrypted with a unique DEK. This DEK is then encrypted with a Master Encryption Key (or a user-specific key derived from their password). The encrypted DEK is stored alongside the encrypted data blob. The Master Key is stored in a secure KMS (e.g., HashiCorp Vault, AWS KMS).
    -   **Secret Management**: All application secrets (JWT secret, DB passwords, Master Key) **must** be managed via a proper secrets management system, not in environment variables in production.
    -   **Database Security**: Enforce strict access controls on all databases. Encrypt sensitive fields even within the database where appropriate.

### 5. Denial of Service (DoS)

-   **Threat**: An attacker makes the system unavailable to legitimate users.
    -   *Resource Exhaustion*: Overwhelming services with traffic, filling up disk space, or maxing out CPU/memory.
-   **Mitigation**:
    -   Rate limiting at the API Gateway.
    -   Container resource limits (CPU/memory) defined in the `docker-compose.yml`.
    -   Horizontal scaling of services based on load.
    -   Protection from cloud provider (e.g., AWS Shield).

### 6. Elevation of Privilege

-   **Threat**: An attacker with limited access gains a higher level of permissions.
    -   *Lateral Movement*: A compromised service (e.g., `notification-service`) is used to attack another service (e.g., `user-profile-service`).
-   **Mitigation**:
    -   **Least Privilege**: Each service has its own database credentials and can only access the data it needs.
    -   **Service Isolation**: Services run in separate containers on a private network, restricting communication paths.
    -   **Code Quality**: Rigorous code reviews, static analysis (SAST), and dependency scanning to prevent vulnerabilities that could be exploited for privilege escalation.

## Security TODOs (MVP → v1)

-   [ ] **mTLS**: Implement mutual TLS for all service-to-service communication.
-   [ ] **Secrets Management**: Integrate HashiCorp Vault or a cloud provider's KMS/Secrets Manager. Remove all secrets from `.env` files for production.
-   [ ] **Database Migrations**: Use a tool like `golang-migrate` to manage schema changes securely.
-   [ ] **SAST/DAST/SCA**: Integrate static analysis, dynamic analysis, and software composition analysis into the CI/CD pipeline.
-   [ ] **Audit Trail**: Implement a dedicated, immutable audit log for all sensitive actions.
-   [ ] **Egress Controls**: Configure strict network policies to control outbound traffic from all services.
