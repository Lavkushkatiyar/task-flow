# TaskFlow: Full-Stack Task Management & User API

## Table of Contents

1. [Project Summary](#project-summary)
2. [Goals & Scope](#goals--scope)
3. [Technology Stack](#technology-stack)
4. [Architecture & Design](#architecture--design)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Reference (Stable Endpoints)](#api-reference-stable-endpoints)
8. [Environment & Configuration](#environment--configuration)
9. [Local Development](#local-development)
10. [Docker Implementation](#docker-implementation)
11. [Testing](#testing)
12. [Error Handling & Logging](#error-handling--logging)
13. [Security Considerations](#security-considerations)
14. [Future Improvements](#future-improvements)
15. [Appendix: Sample Flows](#appendix-sample-flows)

---

## Project Summary

TaskFlow is a production-oriented full-stack application that provides robust user management and task tracking capabilities. It features a modular Node.js/Express backend following clean architecture principles and a modern, responsive React frontend.

**Key Design Pillars:**
- **Modularity:** Separation of concerns across controllers, routes, entities, and utilities.
- **Security by Default:** Bcrypt hashing, JWT stateless auth, and role-based access control.
- **Developer Experience:** Clear API contracts and comprehensive documentation.

---

## Goals & Scope

**In-scope:**
- Full-stack integration (Backend API + React Frontend).
- Secure user registration and authentication (JWT).
- Role-Based Access Control (RBAC): `user` and `admin` roles.
- Task management (CRUD) with ownership boundaries.
- Admin dashboard features: User management (promote/demote/delete) and global task visibility.
- Containerization with Docker.

**Out-of-scope:**
- OAuth2/Social Login.
- Advanced task filtering/pagination.
- Real-time notifications (WebSockets).

---

## Technology Stack

- **Backend Runtime:** Node.js (LTS)
- **Web Framework:** Express.js
- **ORM:** TypeORM
- **Database:** SQLite (dev.db)
- **Frontend:** React + Vite
- **Authentication:** jsonwebtoken (JWT)
- **Password Hashing:** Bcrypt
- **Containerization:** Docker (Alpine Node 18)
- **Testing:** Jest + Supertest
- **Dev tooling:** nodemon (optional), eslint (project linting), prettier (formatting)

---

## Architecture & Design

The project follows a layered directory structure inside `src/` to isolate side effects and business logic:

```text
/backend-part
  /src
    /controllers    # Orchestrate request/response and call utils
    /db             # TypeORM Data Source and database initialization
    /entities       # TypeORM Entity definitions (User, Task)
    /middleware     # Global and route-level middleware (Auth, Validation)
    /routes         # Modular routing (auth.routes.js, task.routes.js, etc.)
    /utils          # Core logic (Password hashing, JWT, Seeding)
    app.js          # Express application and middleware configuration
    server.js       # Main entry point: DB init -> App start
  /frontend         # React + Vite application (Full UI)
  .env              # Environment-specific configuration
  Dockerfile        # Container definition
  package.json      # Backend dependencies and orchestration scripts
```

---

## Database Schema

The system persists data using TypeORM with two primary entities:

### `User` (table: users)
| Column      | Type     | Notes                                  |
| ----------- | -------- | -------------------------------------- |
| id          | varchar  | PK (Email or unique string identifier) |
| password    | varchar  | Bcrypt (10 rounds) hashed password     |
| role        | varchar  | `user` or `admin`                      |
| created_at  | datetime | Auto-generated UTC timestamp           |

### `Task` (table: tasks)
| Column      | Type     | Notes                                  |
| ----------- | -------- | -------------------------------------- |
| id          | varchar  | PK (`task_<timestamp>`)                |
| title       | varchar  | Required title text                    |
| description | varchar  | Optional details                       |
| status      | varchar  | `pending` or `completed`               |
| user_id     | varchar  | FK -> users.id (Owner)                 |

---

## Authentication & Authorization

### TaskFlow implements a stateless JWT flow:

1. Register (`POST /auth/register`) with `{ id, password }`.
2. Server hashes password with bcrypt and stores user with default role `user` (unless seeded differently).
3. Login (`POST /auth/login`) with `{ id, password }`.
4. Server verifies credentials and returns a JWT signed with `JWT_SECRET`.
5. Client includes `Authorization: Bearer <token>` for protected endpoints.
6. Authentication middleware extracts and verifies token and appends `req.user` with `id` and `role`.
7. Authorization checks within controllers confirm resource ownership or admin role.

**Note:** The code enforces a strict payload validation for auth endpoints — request bodies must contain only `id` and `password` or will receive `400 Bad Request`.

---

## API Reference (Stable Endpoints)

### Auth Endpoints
- `POST /auth/register`: `{ id, password }`
- `POST /auth/login`: `{ id, password }` -> Returns `{ token }`

### Task Endpoints (Protected)
- `GET /tasks`: List my tasks (Admins see all).
- `POST /tasks`: `{ title, description }`.
- `PUT /tasks/:id`: Update status/title/description.
- `DELETE /tasks/:id`: Remove a task.

### User/Admin Endpoints (Admin Only)
- `GET /users`: List all system users.
- `PUT /users/:id/role`: `{ role }` (Promote/Demote user).
- `DELETE /users/:id`: Remove a user account.

---

## Environment & Configuration

Create a `.env` file in the root based on `.env.example`:
```env
PORT=8000
JWT_SECRET=your_super_secret_key
NODE_ENV=development
ADMIN_EMAIL=admin@taskflow.com
ADMIN_PASSWORD=admin123
```

---

## Local Development

### 1. Unified Run (Recommended)
To run both the backend and frontend with a single command from the root directory:
```bash
npm install
npm run dev:all
```

### 2. Manual Setup (Optional)

#### Backend Setup
```bash
npm install
npm run dev   
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev  
```

---

## Docker Implementation

The project includes a production-ready Dockerfile for the backend.

### Build Image
```bash
docker build -t taskflow-backend .
```

### Run Container
```bash
docker run -p 8000:8000 --env-file .env taskflow-backend
```

**Dockerfile Highlights:**
- Uses `node:18-alpine` for minimal image size.
- Cleanly installs only production dependencies (`npm ci --only=production`).
- Exposes port 8000 and executes `src/server.js`.

---

## Testing

Automated tests are implemented with Jest + Supertest. Tests run against an in-memory or test SQLite database to isolate side effects.

### Run tests

```bash
npm test
```
Tests use an in-memory database configuration when `NODE_ENV=test` is detected.

---

## Security Considerations

- **Secrets Management:** Sensitive keys are managed via environment variables and never committed.
- **Payload Validation:** Controllers enforce strict key checks to prevent mass-assignment vulnerabilities.
- **Ownership Enforcement:** Users can only modify or delete tasks they own (strictly enforced in `task_utils`).
- **Container Security:** Runs as a non-privileged user inside the container (recommended).

---

## Future Improvements

- [ ] Multi-stage Docker build for both React and Node.js.
- [ ] Integration of a logging service (e.g., Winston or Pino).
- [ ] Swagger/OpenAPI documentation for interactive API testing.
- [ ] Migration to PostgreSQL for production environments.

---

## Appendix: Sample Flows

### Register & Login Flow (CLI)
```bash
# 1. Register
curl -X POST http://localhost:8000/auth/register -H "Content-Type: application/json" -d '{"id":"dev@test.com","password":"securepassword"}'

# 2. Login
curl -X POST http://localhost:8000/auth/login -H "Content-Type: application/json" -d '{"id":"dev@test.com","password":"securepassword"}'
```

---

## Contributing

- Keep changes modular and small.
- Add tests for new behaviors and edge cases.
- Follow the repository's linting and formatting rules.
- When changing a public API contract, update this README and the test suite.

---

## Contact / Maintainers

- Primary maintainer: repository owner (see `package.json` / repo metadata)
- For critical issues, open an issue and tag maintainers

---
