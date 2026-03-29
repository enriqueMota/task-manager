# Prompting Timeline

This document records a representative selection of the actual prompts used during development of the Task Manager project. For the sake of simplicity not all prompts were included, many more were used to fix bugs and refine the implementation.

---

## Phase 2 — Shared Layer (Tasks 11, 13, 14)

### Task 11 — TaskStatus Type

> Follow .github/copilot-instructions.md strictly.
> We are on task 11 in AI_TASKS.md.
> Create TaskStatus as a string literal union type inside packages/shared/src/task-status.ts.
> Values: "pending" | "in-progress" | "completed".
> Also export a readonly array of allowed values for Zod usage.
> No TypeScript enum.
> No default export.
> Strict typing only.

### Task 13 — Shared Barrel Exports

> Follow .github/copilot-instructions.md strictly.
> We are on task 13 in AI_TASKS.md.
> Update packages/shared/src/index.ts to export TaskStatus and TaskPriority types and their value arrays.
> Use named exports only.
> No default exports.
> Do not re-export using wildcard.
> Be explicit.

### Task 14 — Shared Zod Schemas

> Follow .github/copilot-instructions.md strictly.
> We are on task 14 in AI_TASKS.md.
>
> Create shared Zod schemas inside packages/shared/src/task.schema.ts.
>
> Requirements:
>
> - Import TaskStatusValues and TaskPriorityValues.
> - Create TaskStatusSchema using z.enum with TaskStatusValues.
> - Create TaskPrioritySchema using z.enum with TaskPriorityValues.
> - Create CreateTaskSchema with:
>   - title: string, min 3, max 100
>   - description: optional string, max 500
>   - status: TaskStatusSchema
>   - priority: TaskPrioritySchema
>   - dueDate: optional ISO date string
>   - assignee: optional string
> - Export inferred TypeScript types.
> - No default exports.
> - Strict typing only.

---

## Phase 3 — Backend Architecture Skeleton (Tasks 17, 18, 19)

### Task 17 — Repository Interface

> Follow .github/copilot-instructions.md strictly.
> We are on task 17 in AI_TASKS.md.
>
> Create TaskRepository interface inside:
> apps/api/src/modules/tasks/domain/repositories/task.repository.interface.ts
>
> Requirements:
>
> - Pure TypeScript interface.
> - No Prisma imports.
> - No NestJS imports.
> - Use the Task domain entity.
> - Define methods:
>
>   create(task: Task): Promise\<Task\>
>   findById(id: string): Promise\<Task | null\>
>   findAll(filters?: {
>   status?: TaskStatus
>   priority?: TaskPriority
>   assignee?: string
>   }, sort?: {
>   field: "dueDate" | "priority" | "createdAt"
>   direction: "asc" | "desc"
>   }): Promise\<Task[]\>
>   update(task: Task): Promise\<Task\>
>   delete(id: string): Promise\<void\>
>   getStats(): Promise\<{
>   byStatus: Record\<string, number\>
>   byPriority: Record\<string, number\>
>   }\>
>
> - Explicit return types.
> - No default export.

### Task 18 — Prisma Schema

> Follow .github/copilot-instructions.md strictly.
> We are on task 18 in AI_TASKS.md.
>
> Define the Prisma Task model inside schema.prisma.
>
> Requirements:
>
> - id: String @id @default(uuid())
> - title: String
> - description: String?
> - status: String
> - priority: String
> - dueDate: DateTime?
> - assignee: String?
> - createdAt: DateTime @default(now())
> - updatedAt: DateTime @updatedAt
>
> Do not define Prisma enums.
> Keep status and priority as String (domain handles type safety).
> Ensure indexes for:
>
> - status
> - priority
> - assignee

### Task 19 — Prisma Repository Implementation

> Follow .github/copilot-instructions.md strictly.
> We are on task 19 in AI_TASKS.md.
>
> Create PrismaTaskRepository inside:
> apps/api/src/modules/tasks/infrastructure/repositories/prisma-task.repository.ts
>
> Requirements:
>
> - Implement TaskRepository interface.
> - Use PrismaClient.
> - Convert Prisma model to Task domain entity.
> - Convert Task domain entity to Prisma data format.
>
> Important:
>
> - getStats() MUST use Prisma groupBy or raw SQL aggregation.
> - NEVER compute stats in memory.
> - Respect filtering + sorting in findAll().
> - No default export.
> - Explicit return types.
> - Keep mapping logic private inside the class.

---

## Phase 5 — Controllers + Integration (Task 31)

### Task 31 — Swagger Setup

> Follow .github/copilot-instructions.md strictly.
> We are on task 31 in AI_TASKS.md.
>
> Setup Swagger (OpenAPI) in main.ts.
>
> Requirements:
>
> - Use SwaggerModule.
> - Configure document with title "Task Manager API".
> - Expose at /api/docs.
> - Do not pollute domain layer.
> - Keep setup minimal and clean.

---

## Phase 7 — Frontend Features (Mega-Prompt)

> Follow .github/copilot-instructions.md strictly. We are on Phase 7 in AI_TASKS.md. Implement the complete frontend pages and UI architecture inside apps/web using Next.js App Router, TypeScript strict mode, Tailwind, shadcn/ui, Zustand, TanStack Query, React Hook Form, and Zod. Create pages: /tasks (list view with filtering, sorting, pagination-ready structure), /tasks/new (create form), /tasks/[id] (details + edit form), and integrate /dashboard section showing stats (status + priority counts). Use TanStack Query for all server communication (no fetch outside query hooks), create a dedicated lib/api-client.ts abstraction, colocate query hooks under modules/tasks/hooks, and keep components split into components/ui (pure presentational) and modules/tasks/components (feature components). Use shared enums from @task-manager/shared for status/priority, validate all forms with Zod schemas, integrate RHF with shadcn inputs, and ensure no business logic exists inside pages (only orchestration). Implement optimistic updates for create/update/delete. Use a global Zustand store only for UI state (filters, modal open/close), never for server data. Apply consistent loading, error, and empty states. Use strict typing everywhere, no any, no default exports, no duplicated types, no hardcoded enum strings. Structure must remain scalable and modular. Generate minimal unit tests (Vitest + Testing Library) for at least one list component and one form component. Maintain clean separation between UI, hooks, and API layer.

---

## Prompting Patterns Observed

1. **Guardrail anchoring**: Every prompt begins with "Follow .github/copilot-instructions.md strictly" to enforce architectural constraints.
2. **Task-driven scoping**: Referencing specific AI_TASKS.md task numbers prevents scope creep and keeps sessions focused.
3. **Negative constraints**: Explicitly stating what NOT to do ("No TypeScript enum", "No Prisma imports", "No default export") is as important as stating what to build.
4. **Mega-prompts for large phases**: Phase 7 used a single dense prompt covering the full frontend feature set, relying on the copilot-instructions to enforce patterns.

---

**Last Updated:** 2026-03-29
