# Task Manager

A full-stack task management application built with **NestJS**, **Next.js**, **PostgreSQL**, and **Zod** — developed inside a **pnpm monorepo** following **Pragmatic Clean Architecture** with vertical feature slicing.

Built as an AI-assisted development exercise using GitHub Copilot with strict architectural guardrails defined in `.github/copilot-instructions.md`.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Frontend Features](#frontend-features)
- [Testing](#testing)
- [Architecture Decisions](#architecture-decisions)
- [AI Collaboration Approach](#ai-collaboration-approach)
- [Trade-offs](#trade-offs)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Monorepo (pnpm)                    │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   apps/api   │  │   apps/web   │  │packages/shared│  │
│  │   (NestJS)   │  │  (Next.js)   │  │ (Zod schemas) │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                     shared types,                       │
│                  enums & validation                     │
└─────────────────────────────────────────────────────────┘
```

### Backend Clean Architecture (apps/api)

```
src/
├── shared/            → Global infrastructure (DatabaseModule, PrismaService,
│                        DomainExceptionFilter, HealthController)
└── modules/tasks/
    ├── domain/            → Pure business models (TaskEntity, repository interface)
    │                        Zero framework dependencies
    ├── application/       → Use-cases with single execute() method
    │                        Depends only on domain interfaces
    ├── infrastructure/    → Prisma repository, DB mappers
    │                        Implements domain interfaces
    └── presentation/      → NestJS controllers, DTOs, Zod validation pipes
                             No business logic — delegates to use-cases
```

Each layer has strict import boundaries:

- **Domain** has zero framework imports (no NestJS, no Prisma)
- **Application** depends only on domain interfaces
- **Infrastructure** implements domain interfaces using Prisma
- **Presentation** delegates to use-cases, never touches the DB directly

### Frontend Architecture (apps/web)

```
features/tasks/
├── api/               → Typed API client + response types
├── hooks/             → TanStack Query hooks + key factory
├── store/             → Zustand filter/sort state
├── lib/               → Display utilities
└── components/        → UI components (cards, forms, dialogs, filters)
```

State management is split by responsibility:

- **Server state** → TanStack Query (caching, refetching, invalidation)
- **UI state** → Zustand (filter selections, sort direction)
- **Form state** → React Hook Form (validation, submission)

---

## Tech Stack

| Layer            | Technology                                 | Version      |
| ---------------- | ------------------------------------------ | ------------ |
| Backend          | NestJS                                     | 11.x         |
| Frontend         | Next.js (App Router)                       | 16.2.1       |
| Frontend         | React                                      | 19.2.4       |
| Database         | PostgreSQL                                 | 15           |
| ORM              | Prisma + @prisma/adapter-pg                | 7.6          |
| Dev Runner       | tsx (esbuild-based)                        | 4.x          |
| Validation       | Zod                                        | 4.3.6        |
| Forms            | React Hook Form + Standard Schema Resolver | 7.72 / 5.2.2 |
| State            | Zustand                                    | 5.x          |
| Data Fetching    | TanStack Query                             | 5.x          |
| UI Components    | shadcn/ui + Tailwind CSS                   | v4           |
| Testing          | Vitest + Testing Library                   | 4.1.2        |
| API Docs         | Swagger (via @nestjs/swagger)              | 11.x         |
| Package Manager  | pnpm (workspaces)                          | 10.x         |
| Containerization | Docker Compose                             | v2           |

---

## Project Structure

```
task-manager/
├── .agents/
│   └── skills/                     # Custom AI skills (e.g., frontend-design)
├── .github/
│   └── copilot-instructions.md     # AI agent architectural contract
├── apps/
│   ├── api/                        # NestJS backend
│   │   ├── prisma/
│   │   │   └── schema.prisma       # DB schema with indexes
│   │   ├── src/
│   │   │   ├── main.ts             # Bootstrap + Swagger + global filters
│   │   │   ├── app.module.ts       # Root module
│   │   │   ├── shared/             # Global infrastructure
│   │   │   │   ├── database/       # DatabaseModule + PrismaService
│   │   │   │   ├── filters/        # Global DomainExceptionFilter
│   │   │   │   └── health/         # Health check controller
│   │   │   └── modules/tasks/      # Task feature module
│   │   │       ├── domain/         # Entity + repository interface
│   │   │       ├── application/    # Use-cases + unit tests
│   │   │       ├── infrastructure/ # Prisma repo, mappers
│   │   │       └── presentation/   # Controller, DTOs, pipes
│   │   └── vitest.config.ts
│   └── web/                        # Next.js frontend
│       ├── src/
│       │   ├── app/                # App Router (layout, page)
│       │   ├── components/ui/      # shadcn/ui primitives
│       │   ├── features/tasks/     # Task feature slice
│       │   │   ├── api/            # API client + types
│       │   │   ├── hooks/          # Query hooks + mutations
│       │   │   ├── store/          # Zustand filter store
│       │   │   ├── lib/            # Display utilities
│       │   │   └── components/     # UI components + tests
│       │   ├── providers/          # QueryClient, theme providers
│       │   └── lib/                # Shared utilities (cn)
│       └── vitest.config.ts
├── docker/
│   └── docker-compose.yaml         # PostgreSQL container
├── packages/
│   └── shared/                     # Shared schemas, enums, types
│       └── src/
│           ├── task-status.ts      # TaskStatus enum
│           ├── task-priority.ts    # TaskPriority enum
│           ├── task.schema.ts      # Zod validation schemas
│           └── index.ts            # Barrel exports
├── AI_REFLECTION.md                # Lessons learned from AI collaboration
├── AI_TASKS.md                     # 50-task phased build checklist
├── pnpm-workspace.yaml
└── package.json                    # Root scripts
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** ≥ 10
- **Docker** (for PostgreSQL)

### 1. Clone & Install

```bash
git clone <repo-url> task-manager
cd task-manager
pnpm install
```

### 2. Start PostgreSQL

```bash
docker compose -f docker/docker-compose.yaml up -d
```

This starts PostgreSQL 15 on port **5433** with:

- User: `postgres`
- Password: `postgres`
- Database: `task_manager`

### 3. Configure Environment

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/task_manager"
```

### 4. Run Migrations & Generate Prisma Client

```bash
cd apps/api
pnpm exec prisma migrate dev
pnpm exec prisma generate
```

### 5. Start Both Apps

From the repo root:

```bash
# Terminal 1 — Backend (http://localhost:3000)
pnpm dev:api

# Terminal 2 — Frontend (http://localhost:3001)
pnpm dev:web
```

> **Note:** The API dev server uses [tsx](https://tsx.is/) instead of the default `nest start --watch`. This is because the monorepo's `module: "nodenext"` setting and cross-package path aliases prevent the NestJS built-in compiler from resolving imports correctly at runtime. `tsx` runs TypeScript directly via `esbuild`, bypassing the compilation step entirely.

### 6. Explore the API

Open Swagger docs at: **http://localhost:3000/api/docs**

---

## API Documentation

Base URL: `http://localhost:3000`

### Task Model

| Field         | Type     | Required | Validation                                |
| ------------- | -------- | -------- | ----------------------------------------- |
| `id`          | UUID     | Auto     | UUID v4                                   |
| `title`       | string   | ✅       | 3–100 characters                          |
| `description` | string   | ❌       | Max 500 characters                        |
| `status`      | enum     | ✅       | `pending` \| `in-progress` \| `completed` |
| `priority`    | enum     | ✅       | `low` \| `medium` \| `high`               |
| `dueDate`     | ISO 8601 | ❌       | Valid datetime string                     |
| `assignee`    | string   | ❌       | Free text                                 |
| `createdAt`   | ISO 8601 | Auto     | Timestamp                                 |
| `updatedAt`   | ISO 8601 | Auto     | Timestamp                                 |

### Endpoints

#### `POST /tasks` — Create a task

```json
// Request
{
  "title": "Implement authentication",
  "description": "Add JWT-based auth to the API",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-07-15T00:00:00.000Z",
  "assignee": "Alice"
}

// Response — 201 Created
{
  "id": "a1b2c3d4-...",
  "title": "Implement authentication",
  "description": "Add JWT-based auth to the API",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-07-15T00:00:00.000Z",
  "assignee": "Alice",
  "createdAt": "2025-07-10T12:00:00.000Z",
  "updatedAt": "2025-07-10T12:00:00.000Z"
}
```

#### `GET /tasks` — List tasks (with filtering & sorting)

| Query Param     | Values                                | Description                      |
| --------------- | ------------------------------------- | -------------------------------- |
| `status`        | `pending`, `in-progress`, `completed` | Filter by status                 |
| `priority`      | `low`, `medium`, `high`               | Filter by priority               |
| `assignee`      | Any string                            | Filter by assignee               |
| `sortField`     | `dueDate`, `priority`, `createdAt`    | Sort field                       |
| `sortDirection` | `asc`, `desc`                         | Sort direction (default: `desc`) |

```
GET /tasks?status=pending&priority=high&sortField=dueDate&sortDirection=asc
```

#### `GET /tasks/:id` — Get a single task

Returns `200` with the task, or `404` if not found.

#### `PUT /tasks/:id` — Update a task

All fields are optional (partial update via `UpdateTaskSchema = CreateTaskSchema.partial()`).

```json
// Request
{ "status": "completed", "priority": "low" }

// Response — 200 OK (full updated task)
```

#### `DELETE /tasks/:id` — Delete a task

Returns `204 No Content` on success.

#### `GET /tasks/stats` — Task statistics

```json
// Response — 200 OK
{
  "total": 42,
  "byStatus": { "pending": 15, "in-progress": 12, "completed": 15 },
  "byPriority": { "low": 10, "medium": 20, "high": 12 }
}
```

> Stats use DB-level aggregation (`groupBy` + `count`) — no in-memory filtering.

---

## Frontend Features

| Feature                 | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| **Task List**           | Displays all tasks as cards with status/priority badges   |
| **Create Task**         | Dialog form with Zod validation (shared schemas)          |
| **Edit Task**           | Pre-filled form dialog, partial update via PUT            |
| **Delete Task**         | Confirmation dialog before deletion                       |
| **Stats Dashboard**     | Cards showing total, by-status, and by-priority counts    |
| **Filters**             | Filter by status, priority; sort by date/priority/created |
| **Loading States**      | Skeleton loaders while data is fetching                   |
| **Error Handling**      | Error fallback component with retry                       |
| **Empty States**        | Contextual empty states (no tasks vs. no matches)         |
| **Toast Notifications** | Success/error feedback via Sonner                         |

---

## Testing

### Run All Tests

```bash
# From repo root
pnpm test
```

### Run by App

```bash
pnpm test:api    # 31 backend tests
pnpm test:web    # 30 frontend tests
```

### Test Coverage

```bash
cd apps/api && pnpm test:cov
cd apps/web && pnpm test:cov
```

### Test Strategy

| Layer               | Type        | Tool                     | Count  |
| ------------------- | ----------- | ------------------------ | ------ |
| Use-cases           | Unit        | Vitest                   | 20     |
| Controller          | Integration | Vitest + supertest       | 11     |
| Form validation     | Unit        | Vitest + Testing Library | 11     |
| Component rendering | Unit        | Vitest + Testing Library | 13     |
| Zustand store       | Unit        | Vitest                   | 6      |
| **Total**           |             |                          | **61** |

Backend tests mock repository interfaces — never Prisma directly — ensuring tests validate business logic isolation.

Frontend tests mock shadcn/ui components with native HTML elements to make form interactions testable without a full browser.

---

## Architecture Decisions

### 1. Pragmatic Clean Architecture (Backend)

**Decision**: Four-layer architecture (Domain → Application → Infrastructure → Presentation) with strict import boundaries.

**Why**: Enforces separation of concerns. Use-cases depend only on domain interfaces, making them testable without a database. The repository pattern allows swapping Prisma for any other ORM without touching business logic.

### 2. Shared Validation Schemas

**Decision**: Zod schemas live in `packages/shared` and are used by both backend and frontend.

**Why**: Single source of truth for validation rules. The `CreateTaskSchema` enforces title length (3–100), description max (500), and ISO datetime format in both the API validation pipes and React Hook Form. No duplicated validation logic.

### 3. Zod v4 Standard Schema Protocol

**Decision**: Used `standardSchemaResolver` from `@hookform/resolvers/standard-schema` instead of the traditional `zodResolver`.

**Why**: Zod v4 implements the Standard Schema specification. Using the standard schema resolver is the forward-compatible approach and eliminates the need for framework-specific adapters.

### 4. PUT with Partial Schema for Updates

**Decision**: The update endpoint uses `PUT /tasks/:id` with `UpdateTaskSchema = CreateTaskSchema.partial()`.

**Why**: While PUT traditionally implies full resource replacement, using a partial Zod schema lets clients send only the fields they want to change. This meets the spec's `PUT` requirement while keeping the practical benefit of partial updates — users typically change one or two fields (e.g., status), not the entire resource.

### 5. Vertical Feature Slicing (Frontend)

**Decision**: All task-related code lives under `features/tasks/` with sub-folders for API, hooks, store, and components.

**Why**: Co-locating related code makes features self-contained and easier to navigate. Adding a new feature means adding a new folder, not scattering files across `hooks/`, `components/`, and `api/` at the root level.

### 6. DB-Level Aggregation for Stats

**Decision**: The stats endpoint uses `Promise.all([count(), groupBy(status), groupBy(priority)])` — three concurrent Prisma queries.

**Why**: Never fetches all records to count in memory. The compound indexes (`status+createdAt`, `priority+createdAt`, `status+priority`) ensure filtering and sorting happen at the database level.

### 7. Query Key Factory Pattern

**Decision**: `taskKeys` object defines a hierarchical key factory for TanStack Query.

**Why**: Enables granular cache invalidation. After a mutation, we invalidate `taskKeys.lists()` and `taskKeys.stats()` without touching individual detail caches, keeping the UI responsive.

### 8. Prisma v7 Driver Adapter

**Decision**: Used `@prisma/adapter-pg` with the `pg` driver instead of the default Prisma connection.

**Why**: Prisma v7 requires an explicit driver adapter — `new PrismaClient()` without an adapter throws an error. The `PrismaPg` adapter wraps a PostgreSQL connection string and is passed to the `PrismaService` constructor. This also enables future flexibility (e.g., switching to `@prisma/adapter-neon` for serverless).

### 9. Monorepo with pnpm Workspaces

**Decision**: Single repository with `apps/api`, `apps/web`, and `packages/shared`.

**Why**: Shared schemas and types are consumed as workspace dependencies (`"@task-manager/shared": "workspace:^"`). No publishing, no versioning — just import and use. Root-level scripts (`pnpm test`, `pnpm lint`) run across all packages.

---

## AI Collaboration Approach

### Guardrails: `copilot-instructions.md`

Three levels of AI instructions were defined:

1. **`.github/copilot-instructions.md`** — Global architectural contract: Clean Architecture rules, testing requirements, commit conventions, validation rules, performance awareness
2. **`apps/api/copilot-instructions.md`** — Backend-specific: layer boundaries, repository pattern, mapping rules, no Prisma in use-cases
3. **`apps/web/copilot-instructions.md`** — Frontend-specific: state management separation, component rules, data fetching patterns

These files act as a "constitution" — every AI agent session inherits these constraints automatically.

### Phased Development: `AI_TASKS.md`

The project was built in **9 phases / 50 tasks**, each with a clear scope:

| Phase | Focus                         | Tasks |
| ----- | ----------------------------- | ----- |
| 1     | Monorepo foundation           | 1–10  |
| 2     | Shared validation layer       | 11–14 |
| 3     | Backend architecture skeleton | 15–21 |
| 4     | Use-cases + unit tests        | 22–27 |
| 5     | Controllers + integration     | 28–31 |
| 6     | Frontend foundation           | 32–36 |
| 7     | Frontend features             | 37–43 |
| 8     | Frontend tests                | 44–45 |
| 9     | Finalization                  | 46–50 |

Each task had preconditions: code must compile, lint must pass, tests must pass before marking complete.

### Prompting Strategy

- **Task-driven prompts**: "Implement Task 22 from AI_TASKS.md" — anchored to the checklist
- **Architecture-first**: Instructions file prevents the AI from cutting corners (e.g., putting Prisma in use-cases)
- **Test-first discovery**: Writing tests revealed real bugs — the `dueDate` empty-string-vs-undefined issue was caught by a form validation test, not manual testing
- **Iterative refinement**: Complex problems (like the form test) went through multiple hypotheses before root-cause was found

### Key Lessons from AI Collaboration

1. **Guardrails work**: The `copilot-instructions.md` files prevented architectural drift across 50 tasks
2. **Tests catch what prompts miss**: The dueDate bug was invisible in the schema — only a form submission test revealed that `<input type="datetime-local">` sends `""` (empty string) which fails `z.iso.datetime().optional()` (which expects `undefined`, not `""`)
3. **Phased development prevents scope creep**: The 50-task checklist kept each session focused
4. **Explicit contracts > implicit assumptions**: Specifying "no Prisma in use-cases" in instructions is more reliable than hoping the AI remembers

---

## Trade-offs

| Decision                               | Trade-off                          | Rationale                                                                                                                                                                                                       |
| -------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PUT with partial schema**            | Not strict PUT semantics           | Meets spec requirement for PUT while allowing partial updates via `CreateTaskSchema.partial()` — practical for task editing                                                                                     |
| **Pagination without infinite scroll** | Extra UI for page controls         | Server-side pagination with page/pageSize is implemented; infinite scroll would improve UX but adds frontend complexity                                                                                         |
| **Prisma as ORM**                      | Query builder abstraction overhead | Prisma's type-safe queries and auto-generated client outweigh raw SQL flexibility for this use case                                                                                                             |
| **String enums in DB**                 | Not using PostgreSQL native enums  | Prisma string fields with Zod validation at the application boundary; avoids migration pain when adding enum values                                                                                             |
| **No authentication**                  | No user isolation                  | Out of scope for this exercise; the `assignee` field is free text                                                                                                                                               |
| **standardSchemaResolver**             | Newer, less documented             | Forward-compatible with Zod v4 Standard Schema spec; required discovering the correct import path during development                                                                                            |
| **Server Components not used**         | All components are client-side     | Task management requires heavy interactivity (forms, filters, dialogs) — Server Components would add complexity without meaningful benefit here                                                                 |
| **61 tests, no E2E**                   | No browser-based integration tests | Unit + integration tests cover business logic and component behavior; E2E (Playwright/Cypress) would be the next step for a production app                                                                      |
| **tsx for dev mode**                   | Not using Nest CLI compiler        | `nest start --watch` fails with `module: "nodenext"` + monorepo path aliases; tsx runs TypeScript directly via esbuild, requiring explicit `@Inject()` decorators since esbuild doesn't emit decorator metadata |

---

## Scripts Reference

```bash
# Development
pnpm dev:api              # Start API with tsx watch (port 3000)
pnpm dev:web              # Start Next.js dev server (port 3001)

# Building
pnpm build                # Build both apps

# Testing
pnpm test                 # Run all tests (API + Web)
pnpm test:api             # Run API tests only
pnpm test:web             # Run web tests only

# Linting
pnpm lint                 # Lint both apps
pnpm format               # Format all files with Prettier

# Database
cd apps/api
pnpm exec prisma migrate dev      # Run migrations
pnpm exec prisma studio           # Open Prisma Studio GUI
pnpm exec prisma generate         # Regenerate Prisma Client

# Docker
docker compose -f docker/docker-compose.yaml up -d     # Start Postgres
docker compose -f docker/docker-compose.yaml down       # Stop Postgres
```
