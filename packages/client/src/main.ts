// Placeholder client (Job 01 replaces). Connects to the server and shows status.
import * as THREE from "three";
import { ServerMessage, WORLD_CONFIG } from "@world/protocol";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 1.7, 0);
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(WORLD_CONFIG.worldSize, WORLD_CONFIG.worldSize),
  new THREE.MeshBasicMaterial({ color: 0x4a7c3a }),
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
renderer.setAnimationLoop(() => renderer.render(scene, camera));

const ws = new WebSocket(`ws://${location.hostname}:${WORLD_CONFIG.server.port}${WORLD_CONFIG.server.path}`);
ws.onmessage = (e) => {
  const msg = ServerMessage.safeParse(JSON.parse(e.data));
  if (msg.success && msg.data.type === "hello") console.log("connected", msg.data);
};
