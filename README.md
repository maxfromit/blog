# Mini Blog Platform

A modern, minimal blog platform built with Hasura, Nhost, PostgreSQL, FastAPI, and serverless functions. Designed for robust user role management, secure CRUD operations, and asynchronous payment processing.

## Features

- **User Roles & Permissions:** Fine-grained access control for posts, keywords, and payments.
- **Post Management:** Create, update, soft-delete (hide), and associate posts with keywords. No hard deletes for data safety.
- **Keyword Management:** Add/select keywords, restrict updates/deletes, and support for keyword analytics and moderation.
- **Payment Processing:** Asynchronous payment action via Stripe-mock, with results stored in the database.
- **API Interfaces:**
  - GraphQL (Hasura)
  - REST (FastAPI demo)
  - Serverless (Node.js/TypeScript)
- **Testing:** Automated tests for permissions and business logic using Vitest.
- **Dockerized:** All services run in containers for easy local development.

## Architecture

- **Hasura:** Instant GraphQL API over PostgreSQL, with custom permissions and actions.
- **Nhost:** Authentication and admin tables.
- **FastAPI:** Demo REST endpoints.
- **Serverless Functions:** Payment processing and other async actions.
- **PostgreSQL:** Main data store with schema for posts, keywords, payments, and user roles.
- **Stripe-mock:** Simulated payment processor for development/testing.

## Database Schema Highlights

- `auth.roles`, `auth.users`, `auth.user_roles`: User and role management.
- `public.post`: Posts with soft-delete (`hidden_at`) and status (`draft`, `published`, `archived`).
- `public.keyword`: Keywords, with hide-only (no delete) and analytics support.
- `public.post_keyword`: Many-to-many relation between posts and keywords.
- `public.payment`: Payment records, extensible for future payment purposes.

## Key API Actions

- **processPayment:**
  - Handles Stripe-mock payment and inserts payment data via Apollo GraphQL mutation.
- **GraphQL Mutations:**
  - Insert/update posts, keywords, and post-keyword associations.
  - Soft-delete posts and hide keywords.
- **FastAPI Endpoints:**
  - `/`: Returns greeting.
  - `/items/{item_id}`: Returns item by ID and optional query param.

## Permissions (Hasura)

- Users can only manage their own posts and post-keyword links.
- Only visible (not hidden) posts/keywords are returned to users.
- No hard deletes; all deletions are soft (via `hidden_at`).

## Testing

- Automated tests verify permission logic and business rules (see `backend/test/`).
- Example: Users cannot access hidden posts or insert posts for other users.

## Getting Started

1. Clone the repo and copy `.env` files as needed.
2. Use Docker Compose to start all services.
3. Run tests with `yarn test` in the `backend/test/` directory.

## Topics

- hasura
- graphql
- fastapi
- serverless
- payments
- stripe-mock
- docker
- postgresql
- nhost
- blog-platform
- vitest

---

For more details, see the code and tests in the repository.
