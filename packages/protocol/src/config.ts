// World config constants. Single source of truth for all packages.
import type { Vec3 } from "./schema.js";

export const WORLD_CONFIG = {
  /** Server simulation rate (Hz). */
  tickRate: 20,
  /** Square grassland, side length in world units (1 unit ~ 1 metre). */
  worldSize: 200,
  /** Approx. metres per "step" used in perception text. */
  stepLength: 0.75,
  /** Walking speed, units / second. */
  walkSpeed: 1.6,
  /** Turn rate, degrees / second. */
  turnRate: 120,
  /** Distance within which `say` can be heard, units. */
  hearingRadius: 20,
  /** Distance beyond which things are not seen, units. */
  viewRadius: 60,
  /** Distance at which `enter` / `make_mark` works. */
  interactRadius: 3,
  agentCount: 4,
  /** Each life lasts a random duration within this range (minutes). */
  lifespanMinutes: { min: 25, max: 30 },
  /** Seconds between agent turns (target / hard max) and stagger between agents. */
  turnIntervalSeconds: { target: 12, max: 15 },
  agentStaggerSeconds: 3,
  /** Hard LLM call timeout (ms). On timeout the body keeps its last action. */
  llmTimeoutMs: 10_000,
  llmMaxOutputTokens: 300,
  /** Day/night cycle length (real minutes). */
  dayLengthMinutes: 20,
  /** Birth / death fade duration (seconds). */
  fadeSeconds: 6,
  /** Marks per life (final). */
  marksPerLife: 2,
  writeMaxChars: 300,
  workingMemoryTurns: 8,
  compactEveryTurns: 10,
  server: { port: 8787, path: "/ws" },
} as const;

/** Fixed places. Cave and house are on opposite sides of the origin. */
export const PLACES: Record<"cave" | "house", { pos: Vec3; radius: number; label: string }> = {
  cave: { pos: { x: 40, y: 0, z: -30 }, radius: 8, label: "a low dark opening in a hill" },
  house: { pos: { x: -35, y: 0, z: 25 }, radius: 6, label: "a house" },
};

/** Where replacements appear: near the house, within this radius. */
export const SPAWN = { center: PLACES.house.pos, radius: 10 } as const;

export const SEED_MEMORY = "There is a house. There is a cave.";
