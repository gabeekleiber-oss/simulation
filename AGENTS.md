# Instructions for coding agents working on this repo

## Workflow
1. Read `README.md`, `docs/DESIGN.md`, `docs/PROMPTING.md`.
2. Read your job brief in `jobs/NN-*.md`. Build ONLY that job's deliverables.
3. Create a branch `job-NN-short-name`. Commit small and often. Push the branch and open a PR to `main`.
4. Never edit `packages/protocol` unless your job is Job 00 or you open a PR that only changes the contract and explain why.
5. Meet the acceptance tests in your brief before marking the job done. Add a short `## Status` section at the bottom of your brief noting what is done and what is not.
6. Never commit API keys. Use `.env` (gitignored); document variables in `.env.example`.

## Stack
TypeScript everywhere, pnpm monorepo, Three.js (client), Node + `ws` (server), Zod (validation), Vitest (tests).

## HARD RULES (architectural, not optional)
- **The human visitor does not exist to the simulation.** The visitor is only a browser camera. It must never be an entity on the server, appear in perception output, have a collider, make sounds, or be mentioned in any prompt sent to a model. No code path may let visitor state reach agent prompts.
- **Never put these words in anything sent to an agent model:** user, assistant, AI, model, task, goal, help, simulation, observer, objective, score, prompt. Job 09 provides a lint; use it.
- No goals, rewards, scoring, praise, or feedback to agents. No "what would you like to do?" phrasing.
- The agent's `thought` field is private; agents are never told anyone can read it.
- Every LLM call has a hard 10s timeout; the agent's body keeps its last action on failure and never freezes.
- Everything must run with **mock agents** (no API calls) via `MOCK_AGENTS=1`.
- Keep provider names/models in config, never hard-coded in logic.

## Definition of done
Typechecks, lints, tests pass, runs with `pnpm dev` and `MOCK_AGENTS=1`, documented in the brief's Status section.
