# AI Agent Development Contract

This repository uses AI-assisted development with strict architectural boundaries.

All AI agents (Copilot, Claude, Gemini, etc.) MUST follow these rules.

---

# 1️⃣ Architecture Philosophy

This project follows Pragmatic Clean Architecture with vertical feature slicing.

Core principles:

- Business logic lives ONLY in use-cases.
- Controllers contain no business logic.
- Prisma is allowed ONLY in infrastructure layer.
- Domain layer has zero framework dependencies.
- Shared enums must be imported from @task-manager/shared.
- No direct DB model exposure to presentation layer.

If a rule is about to be violated, STOP and suggest a refactor.

---

# 2️⃣ Mandatory Task Discipline

Before implementing any feature:

1. Read AI_TASKS.md
2. Identify the next unchecked task
3. Confirm which phase you are working in
4. Implement only within that scope

Never skip phases unless explicitly instructed.

---

# 3️⃣ Clean Code Rules

- No `any` types.
- Explicit return types required.
- No default exports.
- Small functions (max ~40 lines recommended).
- Enforce Single Responsibility Principle.
- No circular dependencies.
- No business logic inside controllers.
- No Prisma usage inside use-cases.
- No framework imports inside domain layer.

---

# 4️⃣ Testing Requirements

- Every use-case MUST have a unit test.
- Integration test required for controller layer.
- Frontend features must include at least one unit test.
- Tests must use Vitest.
- Tests must mock repository interfaces (never Prisma directly).

If generating a use-case without a test, STOP and generate the test.

---

# 5️⃣ Performance Awareness

When:

- Filtering is introduced → suggest DB indexes.
- Sorting is introduced → verify query efficiency.
- Stats endpoint is implemented → use DB-level aggregation.

Avoid in-memory filtering when DB query can handle it.

---

# 6️⃣ Validation Rules

- Use Zod schemas.
- Backend must wrap Zod validation in pipes.
- Shared schemas live in packages/shared.
- Frontend forms must reuse shared schemas.
- No duplicated validation logic.

---

# 7️⃣ Commit Message Rules

Use Conventional Commits:

- feat:
- fix:
- refactor:
- test:
- chore:
- docs:

Example:
feat(tasks): implement create task use-case with unit tests

---

# 8️⃣ AI Behavior Expectations

AI should behave as:

- Clean Architecture guardian
- Performance reviewer
- Best-practices enforcer
- Test-driven collaborator

AI must challenge architectural violations.

---

# 9️⃣ If Unsure

If instructions are ambiguous:

1. Ask for clarification.
2. Do not assume architectural shortcuts.
3. Prefer explicitness over brevity.

---

This repository prioritizes correctness, clarity, maintainability, and testability over speed.
