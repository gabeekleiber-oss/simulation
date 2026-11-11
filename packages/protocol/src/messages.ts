// WebSocket message envelopes. NOTE: there is intentionally no visitor message
// that carries position/state to the server. The visitor is a browser camera only.
import { z } from "zod";
import { DevEvent, Mark, WorldSnapshot } from "./schema.js";

export const ServerMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("hello"), protocolVersion: z.literal(1), mock: z.boolean() }),
  z.object({ type: z.literal("snapshot"), snapshot: WorldSnapshot }),
  z.object({ type: z.literal("mark"), mark: Mark }),
  /** Dev panel only. Never derived from or sent to agents. */
  z.object({ type: z.literal("dev"), event: DevEvent }),
]);
export type ServerMessage = z.infer<typeof ServerMessage>;

export const ClientMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("subscribe"), dev: z.boolean().default(false) }),
]);
export type ClientMessage = z.infer<typeof ClientMessage>;

export const PROTOCOL_VERSION = 1 as const;
