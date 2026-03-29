# AI Collaboration Reflection

## How Effective Was the AI Agent?

Working with an AI coding agent across 50 structured tasks revealed a clear pattern: the agent is most effective when operating within explicit constraints.

The `copilot-instructions.md` architectural guardrails were the most impactful decision. They transformed the AI from a code generator into an architecture-aware collaborator. Without them, early sessions drifted toward shortcuts like putting Prisma queries in use-cases or skipping test generation. With them, every session started from the same contract, preventing violations before they shipped.

As documented in our prompting timeline, we relied heavily on task-driven scoping (anchoring sessions to specific `AI_TASKS.md` items) and negative constraints. While we tracked representative prompts for major features, many more iterative prompts were required for bug fixing and fine-tuning the implementation.

## What Did TDD Reveal?

The most valuable debugging moment came from a test, not manual usage. The form submission test for `task-form.tsx` failed silently because an HTML `<input type="datetime-local">` was submitting an empty string `""` instead of `undefined`. Zod's `z.iso.datetime().optional()` rejects `""`. The fix was a simple `setValueAs` transform, but without the test, this bug would have reached users.

This reinforced that tests are a discovery tool. Writing them forced us to confront the actual behavior of form elements, schema validators, and framework interactions — things type-checking alone cannot catch.

## Key Takeaway

AI agents amplify whatever structure you give them. With guardrails, phased tasks, and test-first discipline, the agent produced 61 passing tests across a clean four-layer architecture. The quality of AI-assisted code is determined before the first prompt is written.
