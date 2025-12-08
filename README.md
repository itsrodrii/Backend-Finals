# Team Task Management API - MVP

This repository contains the MVP for a Team Task Management API built with Node.js, Express, Sequelize, and SQLite.

## What it includes
- Models: Users, Projects, Tasks
- RESTful CRUD endpoints for each resource
- Basic middleware: JSON parsing, logging, error handling
- Seed script with sample data
- Jest + Supertest tests (basic coverage)
- SQLite database (file based) by default

## Quickstart

1. Install dependencies:
```bash
npm install
```

2. Create database and run setup (this will sync models and create the sqlite file):
```bash
npm run setup
```

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the dev server:
```bash
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Endpoints (summary)
- `GET /users` - list users
- `GET /users/:id` - get user
- `POST /users` - create user
- `PUT /users/:id` - update user
- `DELETE /users/:id` - delete user

- `GET /projects` - list projects (use ?userId= to filter)
- `GET /projects/:id` - get project
- `POST /projects` - create project
- `PUT /projects/:id` - update project
- `DELETE /projects/:id` - delete project

- `GET /tasks` - list tasks (use ?userId= or ?projectId= to filter)
- `GET /tasks/:id` - get task
- `POST /tasks` - create task
- `PUT /tasks/:id` - update task
- `DELETE /tasks/:id` - delete task

## Tests
Run:
```bash
npm test
```

## Notes
- This MVP intentionally keeps authentication out (per assignment).
- Later you can add password hashing, JWT, and role-based authorization.
