// SHARED CONTRACT (Job 00 owns this). v1.0.0 - FROZEN. Changes only via a contract-only PR.

import { z } from "zod";

export const Vec3 = z.object({ x: z.number(), y: z.number(), z: z.number() });
export type Vec3 = z.infer<typeof Vec3>;

export const Place = z.enum(["cave", "house"]);

// Actions an agent may take (what the model outputs)
export const Action = z.discriminatedUnion("type", [
  z.object({ type: z.literal("walk"), toward: z.string().optional(), direction: z.string().optional(), seconds: z.number().min(1).max(15) }),
  z.object({ type: z.literal("turn"), degrees: z.number().min(-360).max(360) }),
  z.object({ type: z.literal("say"), words: z.string().max(280) }),
  z.object({ type: z.literal("enter"), place: Place }),
  z.object({ type: z.literal("lie_down") }),
  z.object({ type: z.literal("get_up") }),
  z.object({ type: z.literal("make_mark"), kind: z.enum(["draw", "write"]), content: z.string().max(2000) }),
  z.object({ type: z.literal("recall"), about: z.string().max(200) }),
  z.object({ type: z.literal("wait") }),
]);
export type Action = z.infer<typeof Action>;

export const AgentReply = z.object({ thought: z.string(), action: Action });
export type AgentReply = z.infer<typeof AgentReply>;

export const DRAWING_SIZE = 24;
export const DRAWING_PALETTE = ".rgbykwopc"; // '.' = empty; extend in Job 08 if needed

export const Mark = z.object({
  id: z.string(), kind: z.enum(["draw", "write"]), content: z.string(),
  authorLifeId: z.string(), createdAt: z.number(),
});
export type Mark = z.infer<typeof Mark>;

export const AgentBodyState = z.object({
  agentSlot: z.number().int().min(0).max(3),
  lifeId: z.string(),
  pos: Vec3, yaw: z.number(),
  anim: z.enum(["idle", "walk", "sleep", "talk", "turn"]),
  speech: z.string().optional(),
  inside: Place.nullable(),
  alpha: z.number().min(0).max(1), // fade in/out for birth/death
});
export type AgentBodyState = z.infer<typeof AgentBodyState>;

// Server -> client. NOTE: there is intentionally NO visitor entity anywhere in this protocol.
export const WorldSnapshot = z.object({
  t: z.number(), timeOfDay: z.number().min(0).max(1),
  agents: z.array(AgentBodyState), marks: z.array(Mark),
});
export type WorldSnapshot = z.infer<typeof WorldSnapshot>;

// Dev panel only (never reaches agents)
export const DevEvent = z.object({
  t: z.number(), agentSlot: z.number(), lifeId: z.string(),
  thought: z.string().optional(), action: Action.optional(), memory: z.string().optional(),
  provider: z.string().optional(), latencyMs: z.number().optional(),
});
export type DevEvent = z.infer<typeof DevEvent>;
