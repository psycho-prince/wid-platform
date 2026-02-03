# WID Platform (When I Die)

WID is a Zero-Trust digital legacy and inheritance platform designed to securely store encrypted digital assets and release them to designated heirs only after legally verified death.

## Core Principles

*   **Security-first:** Every decision prioritizes the protection of sensitive user data and assets.
*   **Zero-Trust:** No component, internal or external, is implicitly trusted. All requests are authenticated and authorized. The frontend is never trusted.
*   **Auditability > Convenience:** While user experience is important, the ability to audit actions and changes is paramount for trust and legal compliance.
*   **Clean Architecture:** Clear separation of concerns, maintainability, and scalability are key.
*   **Enterprise-grade Repo Structure:** Monorepo design for efficient development and deployment of multiple services.
*   **Investor-demo Ready:** The codebase and infrastructure are structured for clear demonstration of functionality and future potential.

## Legal & Audit Philosophy

The WID platform is "legally defensible by design". This means:
*   **Immutable Audit Trail**: All critical actions and decisions are recorded in a tamper-proof, append-only audit log with cryptographic hashing, providing an undeniable record of events.
*   **Explicit Consent**: User consent for critical actions (e.g., terms of service, inheritance rule creation) is explicitly captured and timestamped, ensuring legal compliance and accountability.
*   **Transparency**: While data is secure, the process and status of death verification and inheritance execution are transparently presented to relevant parties (users, heirs, administrators) through auditable interfaces.
*   **Accountability**: Every action in the system is attributable to an actor (user, system, admin) and linked via correlation IDs, ensuring full accountability.
*   **Clear State Management**: Critical business flows, like death verification, are managed via explicit state machines with immutable logging of state transitions.

## Tech Stack

### Backend
*   **Node.js + NestJS:** Robust, scalable, and modular framework for building efficient server-side applications.
*   **PostgreSQL:** Reliable and feature-rich relational database for structured data.
*   **Redis:** Used for caching, session management, and message queues (abstraction for future use).
*   **JWT Authentication:** Secure token-based authentication for APIs.
*   **Service-to-service Auth Ready:** Foundation for secure communication between microservices.
*   **REST APIs Only:** Simple, stateless, and widely understood API design.

### Frontend
*   **React + TypeScript:** Modern, type-safe, and component-based UI development.
*   **Vite:** Fast and efficient frontend tooling for development and bundling.
*   **Tailwind CSS:** Utility-first CSS framework for rapid and consistent UI styling.
*   **React Router:** Declarative routing for React applications.
*   **React Query (TanStack Query):** Powerful data-fetching and caching library.
*   **Zod for Validation:** TypeScript-first schema declaration and validation library.
*   **Axios-based API client:** Robust HTTP client for API interactions.

### Infrastructure
*   **Docker:** Containerization for consistent development, testing, and production environments.
*   **Docker Compose:** For local multi-container application development and orchestration.
*   **Environment-based Config:** Configuration managed through environment variables for flexibility.
*   **Cloud-agnostic:** Designed to be deployable on any major cloud provider.

## Repository Structure

The project is structured as a monorepo to manage multiple applications and services efficiently.

```
wid-platform/
├── apps/
│   ├── web/                    # React frontend application
│   └── api-gateway/            # Central entry point for all API requests, routes to services
│
├── services/
│   ├── auth-service/           # Handles user authentication and authorization
│   ├── user-profile-service/   # Manages user personal data
│   ├── asset-vault-service/    # Stores metadata of user's digital assets
│   ├── inheritance-rules-service/ # Defines and manages inheritance logic
│   ├── death-verification-service/ # Stubs for external death verification (pluggable)
│   ├── notification-service/   # Handles user notifications (email, SMS, etc.)
│   └── audit-service/          # Dedicated immutable audit log
│
├── packages/
│   └── contracts/              # Shared Zod schemas for API interfaces
│
├── infra/
│   ├── docker/                 # Docker-related configurations and helper scripts
│   └── terraform/              # Skeleton for infrastructure as code (cloud-agnostic)
│
├── docker-compose.yml          # Defines and runs multi-container Docker applications
├── README.md                   # Project documentation
├── .env.example                # Example environment variables
└── .gitignore                  # Specifies intentionally untracked files to ignore
```

## Security Architecture Overview (ASCII Diagram)

```
+------------------+     +--------------------+     +---------------------------------------------------------------------------------------+
|   Client Device  |     |   API Gateway      |     |                                Internal Microservices (HMAC Protected)                |
| (Web Browser)    |     | (NestJS / Docker)  |     |                                                                                       |
+--------+---------+     +----------+---------+     +-------------------+ +-------------------+ +-------------------+ +-------------------+
         | HTTPS          |          | JWT Verify/Rate Limit            | |                   | |                   | |                   |
         |                |          | Audit Logging (Request/Response) | |                   | |                   | |                   |
         |                |          | Correlation ID Generation        | |                   | |                   | |                   |
         |                |          | HMAC Sign Internal Request       | |                   | |                   | |                   |
         v                v          |                                  | |                   | |                   | |                   |
+--------+----------------+----------+----------------------------------+ |                   | |                   | |                   |
| Frontend (React / Nginx) |          |                                  | |                   | |                   | |                   |
| - User Input Validation  |          | (Proxies & Adds Headers)         | |                   | |                   | |                   |
| - Legal-Safe UX          |<---------|----------------------------------| |                   | |                   | |                   |
+--------------------------+          |              ^ Internal HMAC Signed Request (X-User-Id, X-User-Email, X-Correlation-Id)              |
                                      |              |                                     |                   | |                   |
                                      +--------------+-------------------------------------+-------------------+ +-------------------+
                                                     |                                     |                   | |                   |
                                                     v                                     v                   v v                   v
                                                +----+--------+                     +----+--------+       +----+--------+       +----+--------+
                                                | Auth Service|                     | Audit Service |       | Death Ver.  |       | Other        |
                                                | (NestJS)    |                     | (NestJS)      |       | Service     |       | Services     |
                                                | - JWT Sign  |                     | - Append-only |       | (NestJS)    |       | (NestJS)     |
                                                | - User Auth |<-------------------->| Audit Log     |<------>| - State Mchn|       | - Stubs      |
                                                +-------------+                     +---------------+       | - Orchestr.|       | - HMAC Verify|
                                                      |                                     |                   +-------------+       +--------------+
                                                      | (Private Network)                   |                               |
                                                      v                                     v                               v
                                                +-----+------+                      +-----+------+                       +-----+------+
                                                | PostgreSQL |                      | PostgreSQL |                       | PostgreSQL |
                                                | (Auth DB)  |                      | (Audit DB) |                       | (Other DBs)|
                                                +------------+                      +------------+                       +------------+
                                                                                    ^                                      ^
                                                                                    |                                      |
                                                                                    | Internal Calls (HMAC Signed)         | Internal Calls (HMAC Signed)
                                                                                    +--------------------------------------+
```

## End-to-End MVP Flow: Death Verification → Inheritance Execution

This MVP demonstrates a critical, legally defensible business flow:
1.  **Death Verification Request**: A user (or authorized party) initiates a request for death verification, potentially by providing supporting documentation (MVP: simulated data). The request enters `unverified` or `pending_review` state.
2.  **Admin Review**: An administrator or automated system reviews the verification request. This can include manual override. The decision (verified/rejected) is immutably logged.
3.  **Verification Event**: Upon `verified` status, the `death-verification-service` emits an internal event (MVP: direct service calls).
4.  **Rule Evaluation**: The `inheritance-rules-service` is triggered. It evaluates all active inheritance rules for the deceased user.
5.  **Asset Release**: The `asset-vault-service` is instructed to mark the user's digital assets as `releasable`, making them available for inheritance according to rules.
6.  **Notifications**: The `notification-service` sends out relevant notifications (e.g., to designated heirs, system administrators).
7.  **Comprehensive Audit**: Every step of this flow, from request creation, status changes, rule evaluation, asset marking, and notifications, generates immutable audit log entries in the dedicated `audit-service`. These entries include actor, action, target, and a correlation ID linking the entire process.

This flow is designed to be **idempotent**, **logged**, and **visible in the UI** (through audit trail and future state indicators), ensuring legal defensibility and auditability.

## Local Setup

To run the WID platform locally using Docker Compose, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    cd wid-platform
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory by copying `.env.example` and filling in any necessary values.
    ```bash
    cp .env.example .env
    # Open .env and customize if needed
    ```

3.  **Build and Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    *   Build Docker images for the frontend (`web`), API Gateway, and all backend services.
    *   Start all services, including PostgreSQL and Redis.
    *   Expose the frontend on `http://localhost:80` and the API Gateway on `http://localhost:3000`.

4.  **Access the Application:**
    Once all services are up and running, open your web browser and navigate to `http://localhost:80` to access the WID frontend.

### Troubleshooting

*   If you encounter issues during `docker-compose up`, try rebuilding with `docker-compose down -v --remove-orphans && docker-compose up --build`.
*   Check Docker container logs for specific error messages: `docker-compose logs <service_name>`.

## Future Roadmap (MVP vs. V1 Boundaries)

### Minimum Viable Product (MVP) - (Current State)
The current state is a **fully functional, security-hardened, and audit-ready MVP** that demonstrates the core "Death Verification → Inheritance Execution" flow.

*   **Shared Contracts:** Centralized Zod schemas for API interfaces in `packages/contracts`.
*   **Zero-Trust API Gateway:** JWT verification, user identity extraction, correlation ID generation, HMAC signing for internal requests, rate limiting, and centralized error handling.
*   **Real Business Flow (Death Verification)**: `death-verification-service` with state machine (`unverified`, `pending_review`, `verified`, `rejected`), admin override, and orchestration of downstream services upon `verified` status.
*   **First-Class Audit Log:** Dedicated `audit-service` with append-only immutable logs, cryptographic hashing, and a read-only API. Gateway-enforced audit logging for requests/responses/errors.
*   **Legal-Safe UX:** Frontend with explicit consent capture (Terms & Conditions), irreversible action confirmations (delete asset/rule), and a read-only audit timeline UI.
*   **Security Baseline:** HMAC authentication for all internal service communication. Minimal integration tests for auth and death verification flow. Updated `SECURITY.md` with threat assumptions, trust boundaries, and key management notes.
*   **Full Observability Foundation**: Correlation IDs propagated across services.

### Version 1 (V1) - Key Enhancements (Beyond MVP)
*   **Robust User Management:** Password reset, email verification, multi-factor authentication (MFA).
*   **Full User Profile Management:** CRUD operations for user details, preferences (`user-profile-service`).
*   **Secure Asset Storage (Full):** Integration with a secure, encrypted storage solution (e.g., IPFS, dedicated vault service) for actual digital assets. Client-side encryption.
*   **Advanced Inheritance Rules:** Complex rule definitions, conditional releases, heir management.
*   **Death Verification Integration:** Actual integration with external death verification APIs/services.
*   **Notification System:** Full implementation for email/SMS notifications (`notification-service`).
*   **Admin Panel:** Comprehensive UI for platform administration, monitoring, and auditing.
*   **Observability:** Full integration with monitoring (Prometheus/Grafana), tracing (Jaeger).
*   **Deployment Automation:** Terraform for cloud infrastructure provisioning, CI/CD pipelines.
*   **Enhanced Security:** mTLS for inter-service communication, robust secrets management (Vault/KMS).
*   **Frontend Polish:** Improved UI/UX, detailed asset views, real-time updates.
*   **Authorization:** Implement Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC).

## Explicit TODO Section

*   **Backend Services (General):**
    *   Implement DTOs (Data Transfer Objects) and validation for all API endpoints (where not already done).
    *   Implement proper error handling and logging across all services.
    *   Add comprehensive unit and integration tests for all services.
    *   Implement Redis for caching and/or queuing where appropriate (e.g., notification queue).
    *   Configure CORS appropriately for all services.

*   **`auth-service`:**
    *   Add user roles and permissions (RBAC).
    *   Implement refresh tokens for JWT.
    *   Email verification for new user registrations.

*   **`user-profile-service`:**
    *   Implement full CRUD operations for user profiles.
    *   Connect to PostgreSQL and define `UserProfile` entity.

*   **`asset-vault-service`:**
    *   Implement metadata storage and retrieval.
    *   Implement CRUD for assets.
    *   Placeholder for actual encrypted asset storage integration.

*   **`inheritance-rules-service`:**
    *   Implement full CRUD for inheritance rules.
    *   Connect to PostgreSQL and define `InheritanceRule` entity.

*   **`death-verification-service`:**
    *   Implement admin/manual override path in UI.
    *   Implement integration with a mock external death verification service.

*   **`notification-service`:**
    *   Implement email sending (e.g., SendGrid, Nodemailer).
    *   Implement SMS sending (e.g., Twilio).
    *   Connect to Redis for message queueing.

*   **Frontend (`apps/web`):**
    *   Implement full functionality for Asset Vault, Inheritance Rules, and Account & Security pages, integrating with backend APIs.
    *   Enhance UI/UX and visual design using Tailwind CSS.
    *   Add error boundaries and global error handling.
    *   Implement proper loading states and feedback for all asynchronous operations.
    *   Implement a logout functionality that clears the JWT token.
    *   Implement admin interface for death verification.

*   **Infrastructure:**
    *   Refine `docker-compose.yml` for production-like environments (e.g., resource limits, health checks).
    *   Implement `infra/terraform` skeleton for basic cloud setup (e.g., VPC, EKS/ECS, RDS).