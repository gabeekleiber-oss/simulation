// What an agent perceives each turn: plain sensory text, no metadata that
// could leak the machinery. Built by Job 04, consumed by Job 06.
import { z } from "zod";

export const Observation = z.object({
  /** e.g. "a little tired. Standing on grass." */
  body: z.string(),
  /** Lines like "Ahead, about 14 steps: a low dark opening in a hill." */
  seen: z.array(z.string()),
  /** Spoken words by others, e.g. `Someone to your left says: "..."` */
  heard: z.array(z.string()),
  /** Rolling first-person summary (memory tier 2). */
  rememberedRecent: z.string(),
  /** Last ~8 turns verbatim (memory tier 1). */
  lastMoments: z.array(z.string()),
  /** Result of a `recall` action, if any (2-3 snippets). */
  recalled: z.array(z.string()).optional(),
});
export type Observation = z.infer<typeof Observation>;

/** Words that must never appear in agent-facing text (AGENTS.md hard rule). */
export const BANNED_WORDS = [
  "user", "assistant", "ai", "model", "task", "goal", "help",
  "simulation", "observer", "objective", "score", "prompt",
] as const;

/** Returns banned words found (whole-word, case-insensitive). */
export function findBannedWords(text: string): string[] {
  return BANNED_WORDS.filter((w) => new RegExp(`\\b${w}\\b`, "i").test(text));
}

/** Render an Observation to the plain-text turn input (docs/PROMPTING.md). */
export function renderObservation(o: Observation): string {
  const out: string[] = [`[Your body] ${o.body}`];
  out.push(`[Seen] ${o.seen.length ? o.seen.join("\n       ") : "Nothing but grass and sky."}`);
  if (o.heard.length) out.push(`[Heard] ${o.heard.join("\n        ")}`);
  if (o.recalled?.length) out.push(`[Recalled] ${o.recalled.join("\n           ")}`);
  if (o.rememberedRecent) out.push(`[Remembered, recent] ${o.rememberedRecent}`);
  if (o.lastMoments.length) out.push(`[Last few moments] ${o.lastMoments.join("\n")}`);
  return out.join("\n");
}
