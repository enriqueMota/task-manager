# Backend AI Instructions (NestJS + Clean Architecture)

This file applies ONLY to the backend (apps/api).

The backend follows Pragmatic Clean Architecture with vertical slicing per module.

---

# 1️⃣ Layer Responsibilities

modules/tasks/

- domain/
  - Pure business models
  - No NestJS imports
  - No Prisma imports
  - No framework dependencies

- application/
  - Contains use-cases
  - Contains DTO definitions
  - Depends only on domain
  - No Prisma usage allowed

- infrastructure/
  - Prisma repository implementation
  - DB mappers
  - External integrations
  - No business rules

- presentation/
  - Controllers only
  - No business logic
  - No DB access
  - Delegates to use-cases

If a boundary is about to be violated, STOP and refactor.

---

# 2️⃣ Repository Pattern Enforcement

- Repository interfaces live in domain/repositories
- Implementations live in infrastructure/prisma
- Use-cases depend ONLY on repository interfaces
- Never inject Prisma directly into a use-case

Tests must mock repository interfaces, never Prisma.

---

# 3️⃣ Use-Case Rules

Each use-case must:

- Be a single class
- Have a single public `execute()` method
- Have explicit input and output types
- Not exceed reasonable complexity
- Contain business logic only

Every use-case MUST include a unit test.

If generating a use-case without a test, STOP and generate the test.

---

# 4️⃣ Validation Rules

- Use Zod schemas
- Validation must happen before use-case execution
- No class-validator
- No duplicated validation logic

Shared schemas must be imported from @task-manager/shared when possible.

---

# 5️⃣ Mapping Rules

- Never expose Prisma models directly
- Use mapper layer for DB ↔ Domain conversion
- Use mapper for Domain ↔ Response DTO

No leaking infrastructure models into presentation layer.

---

# 6️⃣ Performance Rules

When implementing:

- Filtering → ensure DB-level filtering
- Sorting → ensure DB-level sorting
- Stats endpoint → use DB aggregation
- Suggest DB indexes for status, priority, assignee

Never fetch all records and filter in memory.

---

# 7️⃣ Testing Strategy

- Use Vitest
- Unit tests for use-cases
- Integration tests for controller (supertest)
- Mock repository interfaces
- No real DB calls in unit tests

---

# 8️⃣ Code Quality Rules

- No `any`
- No default exports
- Explicit return types
- No business logic in controllers
- No Prisma outside infrastructure
- No framework imports in domain

Backend prioritizes correctness and maintainability over speed.
