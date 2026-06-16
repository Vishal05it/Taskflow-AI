# TaskFlow AI

A production-quality mini SaaS task management app built with Next.js 15 (App Router), TypeScript, Tailwind CSS, and MongoDB/Mongoose. Includes JWT authentication, full task CRUD, search/filter/sort/pagination, dashboard stats, dark mode, and an optional AI-assisted task description generator.

## Live Demo

Production: https://taskflow-ai-flax-seven.vercel.app

## Tech Stack

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS, React Hooks
- **Backend:** Next.js API Routes, MongoDB, Mongoose
- **Auth:** JWT stored in an httpOnly cookie, bcrypt password hashing
- **Deployment:** Vercel-compatible out of the box

## AI-Assisted Development

This project was intentionally developed using an AI-assisted workflow.

## AI tools were used for:

- Project scaffolding
- Boilerplate generation
- UI generation
- Feature implementation
- Architecture suggestions
- Code refinement

Every generated feature was:

- Manually reviewed
- Tested locally
- Verified in production
- Integrated into the existing architecture

## The complete engineering process is documented inside:

- docs/

- planning.md

- ai-journal.md

- progress-log.md

- reflection.md

## Authentication Features

- User Registration
- User Login
- User Logout
- JWT Authentication
- Secure httpOnly Cookies
- Password Hashing with bcrypt
- Protected Dashboard
- Forgot Password
- Random 5-digit OTP verification
- Two-minute OTP expiration
- Secure Password Reset

## Profile Management

Users can:

- View profile
- Edit profile
- Update name
- Update email

Email updates are validated to ensure duplicate accounts cannot exist.

## Core Features

- Task CRUD
- Task Priorities
- Task Status Tracking
- Dashboard Statistics
- Search
- Filtering
- Sorting
- Pagination
- Responsive UI
- Dark Mode
- Toast Notifications
- Loading States
- Empty States

## AI Features

TaskFlow AI includes an AI-powered task description generator.

When an OpenAI API key is configured:

Task descriptions are generated using AI.

- Without an API key:

The application falls back to an internal deterministic suggestion engine.

The feature remains fully functional regardless of API availability.

## Production Ready Features

- JWT Authentication
- Secure Password Recovery
- OTP Email Verification
- SMTP Email Integration
- User Profile Management
- Shared Client/Server Validation
- Protected API Routes
- Responsive Design
- Dark Mode
- Production Deployment
- Global Error Handling

## Deploying to Vercel

Environment variables required:

- MONGODB_URI

- JWT_SECRET

- JWT_EXPIRES_IN

- OPENAI_API_KEY

- SMTP_HOST

- SMTP_PORT

- SMTP_USER

- SMTP_FROM

- SMTP_PASS

Deploying requires no additional configuration beyond setting these environment variables.

## Project Structure

```
src/
  app/
    (auth)/login/page.tsx        Login page
    (auth)/register/page.tsx     Registration page
    (auth)/layout.tsx            Centered auth card layout
    dashboard/layout.tsx         Server-verified protected layout + navbar
    dashboard/page.tsx           Dashboard: stats, filters, task grid, modals
    api/auth/...                 register / login / logout / me routes
    api/tasks/...                Task CRUD + stats routes
    api/ai/suggest-description/  AI description suggestion route
    layout.tsx                   Root layout, loads the current user server-side
    page.tsx                     Public landing page
  components/
    ui/                          Generic, reusable UI primitives (Button, Input, Modal, ...)
    layout/                      Navbar, ThemeToggle
    tasks/                       Task-specific components (TaskCard, TaskFormModal, ...)
    dashboard/                   StatsCards
    providers/                   Auth / Theme / Toast context providers
  hooks/                         useTasks, useTaskStats, useDebouncedValue
  lib/                           db, auth, validators, apiResponse, aiService, fetcher, ...
  models/                        Mongoose schemas (User, Task)
  types/                         Shared TypeScript types & DTOs
  middleware.ts                  Redirect-only route guard (real auth check happens server-side)
```

## Getting Started

### 1. Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A MongoDB connection string (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable         | Description                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`    | MongoDB connection string                                                                         |
| `JWT_SECRET`     | Long random string used to sign JWTs                                                              |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                                                                         |
| `OPENAI_API_KEY` | Optional. If set, the AI helper calls OpenAI; otherwise it uses a built-in placeholder generator. |
| `SMTP_PORT`      | Use relevant SMTP Port                                                                            |
| `SMTP_HOST`      | The SMTP service you're using ( Gmail, Yahoo etc.)                                                |
| `SMTP_USER`      | The SMTP Admin email                                                                              |
| `SMTP_FROM`      | Email sending account                                                                             |
| `SMTP_PASS`      | Your EMAIL app password ( not Email account password )                                            |

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 5. Build for production

```bash
npm run build
npm run start
```

## Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Add `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and (optionally) `OPENAI_API_KEY` as environment variables in the Vercel project settings.
4. Deploy — no additional configuration is required.

## Features

- **Authentication:** register, login, logout, JWT in an httpOnly cookie, bcrypt-hashed passwords, server-verified protected dashboard.
- **Task CRUD:** create, edit, delete, and update status, with title/description/priority/status/due date.
- **Dashboard:** live counts for total/completed/in-progress/pending tasks.
- **Search, filter, sort:** search by title, filter by priority/status, sort by newest/oldest/due date, with pagination.
- **Validation:** shared Zod schemas validate input on both the client (instant feedback) and the server (source of truth).
- **UX:** toast notifications, loading states, empty states, responsive layout, dark mode (class-based, persisted to `localStorage`).
- **AI helper:** "Suggest with AI" button in the task form generates a task description from the title. Uses OpenAI when `OPENAI_API_KEY` is set, otherwise falls back to a deterministic placeholder generator (`src/lib/aiService.ts`) — fully functional without any API key.

## API Routes

| Method | Route                         | Description                             |
| ------ | ----------------------------- | --------------------------------------- |
| POST   | `/api/auth/register`          | Create an account                       |
| POST   | `/api/auth/login`             | Authenticate and set the auth cookie    |
| POST   | `/api/auth/logout`            | Clear the auth cookie                   |
| GET    | `/api/auth/me`                | Get the current authenticated user      |
| GET    | `/api/tasks`                  | List tasks (search/filter/sort/page)    |
| POST   | `/api/tasks`                  | Create a task                           |
| GET    | `/api/tasks/stats`            | Aggregate task counts for the dashboard |
| GET    | `/api/tasks/:id`              | Get a single task                       |
| PATCH  | `/api/tasks/:id`              | Update a task (including status)        |
| DELETE | `/api/tasks/:id`              | Delete a task                           |
| POST   | `/api/ai/suggest-description` | Generate an AI task description         |

All `/api/tasks*` routes require authentication and are scoped to the logged-in user.

## AI-Assisted Development

TaskFlow AI was intentionally developed using an AI-assisted workflow.

AI tools were used for:

- Project scaffolding
- UI generation
- Boilerplate code
- Feature implementation

All generated code was manually reviewed, tested and integrated.

The complete AI development process is documented in:

docs/

## Notes on Architecture

- **Validation** lives in `src/lib/validators.ts` (Zod) and is reused on both the client form and the API route handlers, so the rules never drift out of sync.
- **`src/middleware.ts`** only checks for the _presence_ of the auth cookie to provide a fast redirect — it does not verify the JWT signature, since `jsonwebtoken`/`bcryptjs` rely on Node APIs unavailable in the Edge runtime. The actual verification (`getCurrentUserId` in `src/lib/auth.ts`) runs server-side in the dashboard layout and every API route, which is the real security boundary.
- **AI integration** is isolated behind `generateTaskDescription()` in `src/lib/aiService.ts`, so swapping providers or adding a real key never touches UI or route code.
