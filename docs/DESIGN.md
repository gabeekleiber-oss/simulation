# Design

## 1. Models and API budget
Free-tier names and limits change often. Verify before committing; keep the provider layer swappable.
~12s per agent turn = ~5 req/min/agent, ~20 RPM total. A 30-min life is ~150 calls per agent, ~600 for the village.

| Provider | Role | Notes |
|---|---|---|
| Google AI Studio (Gemini) | Primary | Strongest Flash-class model, thinking minimal/off |
| NVIDIA NIM | Secondary | Large open instruct models on free credits (not slow reasoning ones) |
| OpenRouter `:free` | Fallback | Low daily caps; overflow only |

Max 15s between turns, so no long-reasoning models. Cap output ~300 tokens, hard 10s timeout. On timeout the body continues its last action. Stagger the four agents ~3s apart. Different models per agent is allowed (different temperaments); same model for all is the controlled setup.

## 2. Architecture
```
Browser (Three.js)  <--WebSocket-->  Node server (authoritative sim)
  - renders world                      - 20 Hz tick, positions, collisions
  - visitor free-fly/walk camera       - perception builder
  - dev panel (thoughts, logs)         - agent orchestrator + LLM gateway
                                       - memory store, cave art store
```
Agents decide at LLM speed; bodies move in real time (an action queues movement that plays out over seconds).

**Visitor invisibility is architectural:** the visitor is only a camera. Not an entity, not in perception, no collider, never in any prompt. Agents never perceive any world edit, sound, or state originating from the visitor.

## 3. Mind, memory, mortality
Memory tiers:
1. Working: last ~8 turns verbatim.
2. Recent: rolling first-person summary regenerated every ~10 turns by a cheap compaction call.
3. Deep archive: older summaries stored but never shown unless the agent chooses `recall{about}` (keyword/embedding search, 2-3 snippets).

Life cycle: random 25-30 min life; death is a fade-out; replacement spawns near the house with no memory of its predecessor. Cave marks persist (inherited culture). Others may remember the one who vanished. Tiredness cycle gives a reason to visit the house, with no goal attached.

Cave marks: exactly two per life, final. Writing capped ~300 chars. Drawing is a 24x24 grid of palette letters rendered as a texture on the wall. Perceived by agents as text (writing) or a coarse grid (drawing).

## 4. The world
Plain grassland and sky, day/night cycle, one cave (a hill with a dark opening and a wall inside), one house (with beds). Nothing else.
