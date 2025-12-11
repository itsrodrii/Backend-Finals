# Team Task Management API - Final

This repository contains the FINAL Team Task Management API built with Node.js, Express, Sequelize, and SQLite.

## Features

- Users, Projects, Tasks (CRUD)
- JWT-based authentication (register/login)
- Role-based authorization (admin, user)
- Pagination/filtering for tasks
- Basic middleware and error handling
- Seed script with sample data (admin + users)
- Jest + Supertest tests (basic)

## Quickstart (local)

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and set secret:

```powershell
copy .env.example .env
# edit .env and set JWT_SECRET
```

3. Create database & seed with sample data:

```bash
npm run setup
npm run seed
```

4. Start the dev server:

```bash
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Auth (example)

- Admin user (seeded): `admin@example.com` / `adminpass`
- Login: `POST /auth/login` with JSON body `{ "email":"admin@example.com", "password":"adminpass" }`
- Use returned token in `Authorization: Bearer <token>` header for protected endpoints.

## Endpoints (summary)

- `POST /auth/register` - register new user
- `POST /auth/login` - login and receive JWT
- `GET /users` - list users (admin only)
- `GET /users/:id` - get user (admin or self)
- `POST /projects` - create project (authenticated)
- `GET /projects` - list projects (admin sees all; users see own)
- `POST /tasks` - create tasks (project owner or admin)
- `GET /tasks` - list tasks (supports filters & pagination)

## Tests

Run tests:

```bash
npm test
```

## Deployment

- Build command: `npm install`
- Start command: `node index.js`
- Environment variables: `NODE_ENV`, `JWT_SECRET`, `DATABASE_URL`
