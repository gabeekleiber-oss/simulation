# Job 00: Contracts & scaffolding (do FIRST, single agent)
**Deliver:** pnpm monorepo (`packages/protocol`, `packages/server`, `packages/client`), tsconfig, eslint, vitest, `pnpm dev` running server+client, finalize and freeze `packages/protocol` (observation text types, WS message envelopes, world config constants: tick rate, world size, cave/house positions, lifespan range, turn interval).
**Accept:** all packages typecheck; protocol has unit tests; other jobs can import `@world/protocol`; `MOCK_AGENTS=1 pnpm dev` starts.

## Status
**Done.**
- pnpm monorepo: `packages/protocol`, `packages/server` (ws placeholder), `packages/client` (Vite + Three.js placeholder). Root tsconfig base, ESLint (flat config), Vitest.
- `packages/protocol` finalized (v1.0.0, frozen): `schema.ts` (actions, replies, marks, body state, snapshot, dev events), `config.ts` (tick rate, world size, cave/house positions, lifespan range, turn interval, timeouts, memory constants), `observation.ts` (Observation type, banned-word list/check, text renderer), `messages.ts` (WS envelopes; no visitor message exists by design). 7 unit tests.
- Verified: `pnpm typecheck`, `pnpm lint`, `pnpm test` pass; `MOCK_AGENTS=1 pnpm dev` starts server (ws://localhost:8787/ws) + client (http://localhost:5173) and the server sends `hello` + `snapshot`.
- Other jobs import via `@world/protocol`.

**Not done / notes:** server and client are placeholders for Jobs 03 and 01. `BANNED_WORDS` in protocol is a minimal helper; Job 09 owns the full lint.
