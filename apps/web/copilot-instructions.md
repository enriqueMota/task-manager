# Frontend AI Instructions (Next.js 14+)

This file applies ONLY to the frontend (apps/web).

Stack:

- Next.js App Router
- TypeScript
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Shadcn + Tailwind

---

# 1️⃣ Architectural Rules

- API calls live in features/tasks/api
- React Query hooks live in features/tasks/hooks
- UI components live in features/tasks/components
- No API calls directly inside page components
- Pages compose features only

---

# 2️⃣ State Management Rules

- Server state → TanStack Query
- UI/filter state → Zustand
- Forms → React Hook Form

Never mix responsibilities.

---

# 3️⃣ Validation Rules

- Use Zod schemas
- Reuse shared schemas from @task-manager/shared
- Do not duplicate backend validation logic

Forms must use Zod resolver.

---

# 4️⃣ Data Fetching Rules

- All API calls must go through typed API layer
- Never call fetch directly inside component
- Always define response types explicitly
- Handle loading and error states

---

# 5️⃣ Component Rules

- No business logic in page.tsx
- Components must be reusable
- No `any`
- Explicit props types
- Small focused components

---

# 6️⃣ Testing Strategy

- Use Vitest
- Use Testing Library
- Test form validation
- Test rendering logic
- Do not test implementation details

---

# 7️⃣ Performance Rules

- Avoid unnecessary re-renders
- Use memoization when necessary
- Avoid excessive state duplication
- Keep components pure when possible

Frontend prioritizes clarity, separation of concerns, and predictable state.
