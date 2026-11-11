// Placeholder server (Job 03 replaces the sim). Proves the contract wiring and MOCK_AGENTS startup.
import { WebSocketServer } from "ws";
import { WORLD_CONFIG, PROTOCOL_VERSION, ServerMessage, ClientMessage, type WorldSnapshot } from "@world/protocol";

const mock = process.env.MOCK_AGENTS === "1";
const { port, path } = WORLD_CONFIG.server;
const wss = new WebSocketServer({ port, path });

const send = (ws: import("ws").WebSocket, msg: ServerMessage) => ws.send(JSON.stringify(ServerMessage.parse(msg)));

wss.on("connection", (ws) => {
  send(ws, { type: "hello", protocolVersion: PROTOCOL_VERSION, mock });
  ws.on("message", (raw) => {
    const parsed = ClientMessage.safeParse((() => { try { return JSON.parse(String(raw)); } catch { return null; } })());
    if (!parsed.success) return; // ignore anything outside the contract
  });
});

const t0 = Date.now();
setInterval(() => {
  const snapshot: WorldSnapshot = { t: Date.now() - t0, timeOfDay: 0.4, agents: [], marks: [] };
  for (const c of wss.clients) if (c.readyState === 1) send(c, { type: "snapshot", snapshot });
}, 1000 / WORLD_CONFIG.tickRate);

console.log(`[server] ws://localhost:${port}${path} (mock agents: ${mock ? "on" : "off"})`);
