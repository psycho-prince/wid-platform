# WID Platform (When I Die)

WID is a Zero-Trust digital legacy and inheritance platform designed to securely store encrypted digital assets and release them to designated heirs only after legally verified death.

## Core Principles

*   **Security-first:** Every decision prioritizes the protection of sensitive user data and assets.
*   **Zero-Trust:** No component, internal or external, is implicitly trusted. All requests are authenticated and authorized. The frontend is never trusted.
*   **Auditability > Convenience:** While user experience is important, the ability to audit actions and changes is paramount for trust and legal compliance.
*   **Clean Architecture:** Clear separation of concerns, maintainability, and scalability are key.
*   **Enterprise-grade Repo Structure:** Monorepo design for efficient development and deployment of multiple services.
*   **Investor-demo Ready:** The codebase and infrastructure are structured for clear demonstration of functionality and future potential.

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
│   └── notification-service/   # Handles user notifications (email, SMS, etc.)
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

## Security Model

The WID platform adheres to a strict Zero-Trust security model. Key aspects include:

*   **Authentication & Authorization:** All API endpoints require authentication via JWT. Authorization checks (e.g., RBAC or ABAC) are performed at the service level, enforced by the API Gateway.
*   **Data Encryption:** All sensitive data, both in transit and at rest, is encrypted. (Currently implemented for passwords, future scope for asset encryption).
*   **Input Validation:** Strict input validation (e.g., using Zod on the frontend, DTO validation on the backend) is applied at all layers to prevent common vulnerabilities like injection attacks.
*   **Secure Communication:** Internal service-to-service communication within the Docker network is assumed to be trusted for local development but will be secured with mutual TLS (mTLS) in production environments.
*   **Least Privilege:** Each service and database user operates with the minimum necessary permissions.
*   **No Secrets in Frontend:** API keys, database credentials, and other sensitive information are strictly confined to backend services and environment variables.
*   **Auditing and Logging:** Comprehensive logging of security-relevant events for auditability and incident response.

## Threat Model (STRIDE-style)

This preliminary threat model identifies potential vulnerabilities using the STRIDE categories:

*   **Spoofing:**
    *   Compromised JWT tokens allowing unauthorized access.
    *   Impersonation of legitimate users or services through stolen credentials.
*   **Tampering:**
    *   Unauthorized modification of asset metadata or inheritance rules.
    *   Manipulation of API requests to bypass validation or authorization.
    *   Database tampering due to SQL injection or unauthorized access.
*   **Repudiation:**
    *   Users denying actions they performed (e.g., setting an inheritance rule). Comprehensive logging is crucial.
    *   Services denying having processed a request.
*   **Information Disclosure:**
    *   Exposure of sensitive user data (e.g., personal details, asset metadata) through insecure APIs or logs.
    *   Leakage of JWT secrets or database credentials.
    *   Side-channel attacks on encrypted assets.
*   **Denial of Service (DoS):**
    *   API flooding or resource exhaustion attacks targeting any service.
    *   Database connection pooling attacks.
    *   Frontend attacks rendering the application unusable.
*   **Elevation of Privilege:**
    *   Regular users gaining administrative privileges.
    *   One microservice gaining unauthorized access to another service's data or functionality.

## Future Roadmap (MVP → v1)

### Minimum Viable Product (MVP) - (Current State)
*   **User Authentication:** Register, Login, JWT issuance.
*   **Basic User Profile:** Placeholder for user data.
*   **Asset Vault (Metadata Only):** List mock assets.
*   **Inheritance Rules (Stubbed):** Basic form for rule creation (heir, delay, condition).
*   **Core Infrastructure:** Dockerized services, `docker-compose` for local dev, PostgreSQL, Redis.
*   **React Frontend:** Basic navigation, protected routes, form handling.
*   **API Gateway:** Routes to core services.

### Version 1 (V1) - Key Enhancements
*   **Robust User Management:** Password reset, email verification, multi-factor authentication (MFA).
*   **Full User Profile Management:** CRUD operations for user details, preferences.
*   **Secure Asset Storage (Full):** Integration with a secure, encrypted storage solution (e.g., IPFS, dedicated vault service) for actual digital assets. Placeholder for actual crypto.
*   **Advanced Inheritance Rules:** Complex rule definitions, conditional releases, heir management.
*   **Death Verification Integration:** Actual integration with external death verification APIs/services.
*   **Notification System:** Email/SMS notifications for critical events (e.g., asset release, rule changes).
*   **Admin Panel:** For platform administration, monitoring, and auditing.
*   **Observability:** Centralized logging, monitoring (Prometheus/Grafana), tracing (Jaeger).
*   **Deployment Automation:** Terraform for cloud infrastructure provisioning, CI/CD pipelines.
*   **Enhanced Security:** mTLS for inter-service communication, robust secrets management.
*   **Frontend Polish:** Improved UI/UX, detailed asset views, real-time updates.

## Explicit TODO Section

*   **Backend Services (General):**
    *   Implement DTOs (Data Transfer Objects) and validation for all API endpoints.
    *   Implement proper error handling and logging across all services.
    *   Implement service-to-service authentication (e.g., using API keys or mTLS).
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
    *   Define `Asset` entity (name, description, ownerId, encrypted_key_location, etc.).
    *   Placeholder for actual encrypted asset storage integration.

*   **`inheritance-rules-service`:**
    *   Implement CRUD for inheritance rules (e.g., beneficiaries, conditions, timelines).
    *   Connect to PostgreSQL and define `InheritanceRule` entity.

*   **`death-verification-service`:**
    *   Implement a more realistic stub or integrate with a mock external service.

*   **`notification-service`:**
    *   Implement email sending (e.g., SendGrid, Nodemailer).
    *   Implement SMS sending (e.g., Twilio).
    *   Connect to Redis for message queueing.

*   **Frontend (`apps/web`):**
    *   Implement full functionality for Asset Vault, Inheritance Rules, and Account & Security pages.
    *   Integrate React Query hooks with all backend API calls.
    *   Enhance UI/UX and visual design using Tailwind CSS.
    *   Add error boundaries and global error handling.
    *   Implement proper loading states and feedback for all asynchronous operations.
    *   Implement a logout functionality that clears the JWT token.

*   **Infrastructure:**
    *   Refine `docker-compose.yml` for production-like environments (e.g., resource limits, health checks).
    *   Implement `infra/terraform` skeleton for basic cloud setup (e.g., VPC, EKS/ECS, RDS).

This README provides a comprehensive overview and a clear path forward for the WID platform.
