# AI Development Task Checklist

This file defines the deterministic build order for the Task Manager monorepo.

---

## ⚠️ Execution Rules for AI Agents

- Always read this file before implementing new code.
- Never skip a task unless explicitly instructed.
- Mark tasks as completed only after:
  - Code compiles
  - Lint passes
  - Tests pass
- If architecture boundaries are at risk, STOP and suggest refactor.
- Always generate tests for use-cases.
- Always use shared enums and schemas.
- If filtering is introduced, suggest DB indexes.
- Do not implement tasks outside the current phase.

---

# 🏗 Phase 1 — Monorepo Foundation

- [x] 1. Initialize pnpm workspace
- [x] 2. Create `apps/api` (NestJS)
- [x] 3. Create `apps/web` (Next.js App Router)
- [x] 4. Create `packages/shared`
- [x] 5. Configure base `tsconfig`
- [x] 6. Setup ESLint + Prettier (strict)
- [x] 7. Configure path aliases
- [x] 8. Setup Vitest (api + web)
- [x] 9. Setup Docker Postgres
- [x] 10. Setup Prisma in backend

---

# 🧱 Phase 2 — Shared Layer

- [x] 11. Create `TaskStatus` enum
- [x] 12. Create `TaskPriority` enum
- [x] 13. Export shared index
- [x] 14. Create shared Zod schemas

---

# 🧠 Phase 3 — Backend Architecture Skeleton

- [x] 15. Create tasks module structure
- [x] 16. Define domain entity
- [x] 17. Define repository interface
- [x] 18. Setup Prisma schema
- [x] 19. Generate Prisma client
- [x] 20. Implement Prisma repository
- [x] 21. Implement mapper layer

---

# ⚙ Phase 4 — Backend Use Cases + Unit Tests

- [ ] 22. CreateTask use-case + unit test
- [ ] 23. ListTasks use-case + unit test
- [ ] 24. GetTask use-case + unit test
- [ ] 25. UpdateTask use-case + unit test
- [ ] 26. DeleteTask use-case + unit test
- [ ] 27. GetTaskStats use-case + unit test

---

# 🌐 Phase 5 — Controllers + Integration

- [ ] 28. Create task controller
- [ ] 29. Wire DI in module
- [ ] 30. Add integration test (supertest)
- [ ] 31. Setup Swagger documentation

---

# 🎨 Phase 6 — Frontend Foundation

- [ ] 32. Setup Shadcn
- [ ] 33. Setup Tailwind
- [ ] 34. Setup TanStack Query
- [ ] 35. Setup Zustand store
- [ ] 36. Integrate shared Zod schemas

---

# 🖥 Phase 7 — Frontend Features

- [ ] 37. Task list page
- [ ] 38. Task create form
- [ ] 39. Task edit page
- [ ] 40. Task delete confirmation
- [ ] 41. Task stats dashboard
- [ ] 42. Loading states
- [ ] 43. Error handling states

---

# 🧪 Phase 8 — Frontend Tests

- [ ] 44. Task form validation test
- [ ] 45. Task table rendering test

---

# 📦 Phase 9 — Finalization

- [ ] 46. Add DB indexes for filtering
- [ ] 47. Performance review
- [ ] 48. Final lint pass
- [ ] 49. Write README architecture section
- [ ] 50. Write AI collaboration reflection
