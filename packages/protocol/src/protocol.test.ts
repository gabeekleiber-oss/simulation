import { describe, expect, it } from "vitest";
import {
  Action, AgentReply, ClientMessage, DRAWING_PALETTE, DRAWING_SIZE, PLACES, ServerMessage,
  WORLD_CONFIG, findBannedWords, renderObservation, SEED_MEMORY,
} from "./index.js";

describe("actions", () => {
  it("parses valid actions", () => {
    expect(Action.parse({ type: "walk", toward: "cave", seconds: 5 }).type).toBe("walk");
    expect(Action.parse({ type: "wait" }).type).toBe("wait");
    expect(AgentReply.parse({ thought: "hm", action: { type: "lie_down" } }).action.type).toBe("lie_down");
  });
  it("rejects invalid actions", () => {
    expect(() => Action.parse({ type: "walk", seconds: 99 })).toThrow();
    expect(() => Action.parse({ type: "fly" })).toThrow();
    expect(() => Action.parse({ type: "enter", place: "moon" })).toThrow();
  });
});

describe("config", () => {
  it("is self-consistent", () => {
    expect(WORLD_CONFIG.lifespanMinutes.min).toBeLessThan(WORLD_CONFIG.lifespanMinutes.max);
    expect(WORLD_CONFIG.turnIntervalSeconds.max).toBeLessThanOrEqual(15);
    expect(WORLD_CONFIG.llmTimeoutMs).toBe(10_000);
    const half = WORLD_CONFIG.worldSize / 2;
    for (const p of Object.values(PLACES)) {
      expect(Math.abs(p.pos.x)).toBeLessThan(half);
      expect(Math.abs(p.pos.z)).toBeLessThan(half);
    }
    expect(DRAWING_SIZE).toBe(24);
    expect(DRAWING_PALETTE.startsWith(".")).toBe(true);
  });
});

describe("messages", () => {
  it("validates server and client envelopes", () => {
    expect(ServerMessage.parse({ type: "hello", protocolVersion: 1, mock: true }).type).toBe("hello");
    expect(ClientMessage.parse({ type: "subscribe" })).toEqual({ type: "subscribe", dev: false });
  });
  it("has no visitor message", () => {
    expect(() => ClientMessage.parse({ type: "visitor", pos: { x: 0, y: 0, z: 0 } })).toThrow();
  });
});

describe("agent-facing text", () => {
  it("detects banned words", () => {
    expect(findBannedWords("You are an AI assistant")).toEqual(expect.arrayContaining(["ai", "assistant"]));
    expect(findBannedWords("A dark opening in a hill.")).toEqual([]);
  });
  it("renders observations without banned words", () => {
    const text = renderObservation({
      body: "a little tired. Standing on grass.",
      seen: ["Ahead, about 14 steps: a low dark opening in a hill."],
      heard: [], rememberedRecent: SEED_MEMORY, lastMoments: [],
    });
    expect(text).toContain("[Seen]");
    expect(findBannedWords(text)).toEqual([]);
  });
});
