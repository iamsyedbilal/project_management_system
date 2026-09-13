# Project Management System — Backend

A TypeScript REST API backend for a collaborative project management system. The backend is built with Express, MongoDB/Mongoose, JWT authentication, Zod validation, and role-based access control.

## Tech Stack

- **Node.js**
- **TypeScript**
- **Express 5**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **Zod** for request validation
- **bcryptjs** for password hashing
- **Nodemailer + Mailgen** for email workflows
- **Winston** for logging
- **CORS + cookie-parser** for API and authentication support

## Project Structure

```text
backend/
├── src/
│   ├── controllers/       # Request/response handling
│   ├── db/                # Database connection
│   ├── middlewares/       # Authentication, authorization and errors
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   ├── utils/             # Shared utilities and constants
│   ├── validators/        # Zod validation schemas
│   ├── app.ts             # Express application setup
│   └── index.ts           # Server entry point
├── public/                # Public/static files
├── PRD.md                 # Product requirements
├── package.json
└── README.md
```

## Core Features

### Authentication

The backend supports the authentication flow defined in the PRD:

- User registration
- User login
- JWT access tokens
- Refresh tokens
- Logout/session handling
- Current-user retrieval
- Password management
- Email verification
- Forgot/reset password workflows

Authentication middleware accepts the access token from either the authentication cookie or the `Authorization: Bearer <token>` header.

### Role-Based Access Control

The system uses three roles:

| Role | Description |
| --- | --- |
| `admin` | Full system/project administration access |
| `project_admin` | Administrative access within assigned projects |
| `member` | Basic project member access |

Project permissions are resolved from the `ProjectMember` relationship. This is important because the same user can have different roles in different projects.

For project-specific routes, the authorization flow is:

```text
verifyJWT
    ↓
validateProjectPermission(...roles)
    ↓
ProjectMember lookup
    ↓
project-specific role
    ↓
controller
```

### Project Management

The project module follows the PRD and includes:

- Create project
- List projects available to a user
- Get project details
- Update project information
- Delete projects
- List project members
- Add project members
- Update member roles
- Remove project members

Project members are stored separately from the project document through the `ProjectMember` model.

```text
Project
  └── _id
       │
       ▼
ProjectMember
  ├── project
  ├── user
  └── role
```

Project member details can be loaded with Mongoose `populate()` when returning user information.

### Tasks and Subtasks

The PRD defines task and subtask management with:

- `todo`
- `in_progress`
- `done`

Task creation/update/deletion is restricted to `admin` and `project_admin`, while project members can view tasks and update subtask status according to the permission matrix.

### Project Notes

Project notes follow the PRD permission model:

- All project members can view notes.
- Only `admin` can create, update, or delete notes.

## Permission Matrix

| Feature | Admin | Project Admin | Member |
| --- | :---: | :---: | :---: |
| Create Project | ✓ | ✗ | ✗ |
| Update/Delete Project | ✓ | ✗ | ✗ |
| Manage Project Members | ✓ | ✗ | ✗ |
| Create/Update/Delete Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |
| Update Subtask Status | ✓ | ✓ | ✓ |
| Create/Delete Subtasks | ✓ | ✓ | ✗ |
| Create/Update/Delete Notes | ✓ | ✗ | ✗ |
| View Notes | ✓ | ✓ | ✓ |

## API Structure

The API is versioned under `/api/v1`.

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/current-user
POST /api/v1/auth/change-password
POST /api/v1/auth/refresh-token
GET  /api/v1/auth/verify-email/:verificationToken
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password/:resetToken
POST /api/v1/auth/resend-email-verification
```

### Projects

```text
GET    /api/v1/projects/
POST   /api/v1/projects/
GET    /api/v1/projects/:projectId
PUT    /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId

GET    /api/v1/projects/:projectId/members
POST   /api/v1/projects/:projectId/members
PUT    /api/v1/projects/:projectId/members/:userId
DELETE /api/v1/projects/:projectId/members/:userId
```

### Tasks

```text
GET    /api/v1/tasks/:projectId
POST   /api/v1/tasks/:projectId
GET    /api/v1/tasks/:projectId/t/:taskId
PUT    /api/v1/tasks/:projectId/t/:taskId
DELETE /api/v1/tasks/:projectId/t/:taskId
POST   /api/v1/tasks/:projectId/t/:taskId/subtasks
PUT    /api/v1/tasks/:projectId/st/:subTaskId
DELETE /api/v1/tasks/:projectId/st/:subTaskId
```

### Notes

```text
GET    /api/v1/notes/:projectId
POST   /api/v1/notes/:projectId
GET    /api/v1/notes/:projectId/n/:noteId
PUT    /api/v1/notes/:projectId/n/:noteId
DELETE /api/v1/notes/:projectId/n/:noteId
```

### Health Check

```text
GET /api/v1/healthcheck/
```

## Environment Variables

Create a `.env` file inside the `backend` directory. The exact variables should match the configuration used by the application, including database, JWT, email, CORS, and server settings.

Example categories:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CORS_ORIGIN=http://localhost:5713
```

Do not commit real secrets or credentials to GitHub.

## Installation

From the `backend` directory:

```bash
npm install
```

## Development

Start the development server with:

```bash
npm run dev
```

The development script runs the TypeScript entry point through `tsx` and watches for changes with Nodemon.

## Production

The current package configuration exposes the server through:

```bash
npm start
```

Before production deployment, configure production environment variables, MongoDB, CORS origins, JWT secrets, email configuration, logging, and the process/runtime strategy for the deployment environment.

## API Design

The backend follows a layered structure:

```text
Request
  ↓
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Model / Database
  ↓
Response
```

- **Routes** define endpoints and middleware order.
- **Middlewares** handle authentication, authorization, and errors.
- **Controllers** validate request-level data and build API responses.
- **Services** contain business logic.
- **Models** define MongoDB/Mongoose data structures.
- **Validators** provide schema validation with Zod.

## Security

The backend includes security mechanisms required by the PRD, including:

- JWT authentication
- Refresh-token based sessions
- Password hashing with bcryptjs
- Role-based authorization
- Request validation
- CORS configuration
- HTTP-only cookie support through `cookie-parser`
- Centralized error handling
- Request logging

## Development Status

The backend is being implemented incrementally according to [`PRD.md`](./PRD.md).

Current development focus includes completing the project-management layer and its project-specific role authorization before moving through the remaining task, subtask, and note functionality.

## Related Documentation

- [Product Requirements Document](./PRD.md)
- [Main Repository](../README.md)

## License

This project is currently being developed as part of the Project Management System implementation.
