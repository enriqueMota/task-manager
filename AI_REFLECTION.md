# AI Collaboration Reflection

## How Effective Was the AI Agent?

Working with an AI coding agent across 50 structured tasks revealed a clear pattern: **the agent is most effective when operating within explicit constraints, and most dangerous when given ambiguity**.

The `copilot-instructions.md` files — three layers of architectural guardrails — were the single most impactful decision. They transformed the AI from a code generator into an architecture-aware collaborator. Without them, early sessions drifted toward shortcuts: putting Prisma queries in use-cases, skipping test generation, exposing database models directly in responses. With them, every session started from the same contract, and violations were caught before they shipped.

The phased task checklist (`AI_TASKS.md`) prevented a different failure mode: scope creep. By anchoring each session to "implement task 22," the agent stayed focused. The 9-phase structure also enforced a natural dependency order — shared schemas before backend, backend before frontend, features before tests.

## What Did TDD Reveal?

The most valuable debugging moment came from a test, not from manual usage. The form submission test for `task-form.tsx` failed silently — the form just wouldn't submit with valid-looking data. After several wrong hypotheses (React 19 synthetic events, RHF Controller vs register, select mock implementation), the root cause turned out to be an HTML `<input type="datetime-local">` submitting an empty string `""` instead of `undefined`. Zod's `z.iso.datetime().optional()` rejects `""` because `.optional()` only permits `undefined`, not empty strings. The fix was a one-line `setValueAs` transform — but without the test, this bug would have reached users.

This experience reinforced that **tests are a discovery tool, not just a verification tool**. Writing them forced us to confront the actual behavior of form elements, schema validators, and framework interactions — things that type-checking alone cannot catch.

## Key Takeaway

AI agents amplify whatever structure you give them. With guardrails, phased tasks, and test-first discipline, the agent produced 60 passing tests across a clean four-layer architecture. Without those constraints, it would have produced working code with invisible architectural debt. **The quality of AI-assisted code is determined before the first prompt is written.**
