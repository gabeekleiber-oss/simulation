# Job 06: Agent orchestrator
**Deliver:** staggered scheduler (4 agents, ~12s each, ~3s offset, never >15s between turns), prompt builder (uses `docs/PROMPTING.md` templates and the memory + perception modules), parse and Zod-validate replies, fallback to `wait`/last action on invalid output or timeout, emit `DevEvent`s.
**Accept:** runs 30 min with mock provider and with a real provider; no overlap bursts; invalid JSON handled.
