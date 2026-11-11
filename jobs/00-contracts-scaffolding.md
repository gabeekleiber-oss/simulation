# Job 00: Contracts & scaffolding (do FIRST, single agent)
**Deliver:** pnpm monorepo (`packages/protocol`, `packages/server`, `packages/client`), tsconfig, eslint, vitest, `pnpm dev` running server+client, finalize and freeze `packages/protocol` (observation text types, WS message envelopes, world config constants: tick rate, world size, cave/house positions, lifespan range, turn interval).
**Accept:** all packages typecheck; protocol has unit tests; other jobs can import `@world/protocol`; `MOCK_AGENTS=1 pnpm dev` starts.
