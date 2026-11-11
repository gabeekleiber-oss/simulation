import * as THREE from "three";
import { ServerMessage, WORLD_CONFIG, PLACES } from "@world/protocol";
import type { Mark, WorldSnapshot } from "@world/protocol";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bc8df);
scene.fog = new THREE.Fog(0x9bc8df, 90, 230);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 2.2, 12);
camera.rotation.order = "YXZ";

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xc6e6ff, 0x53633a, 1.25);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffe0ad, 2.1);
sun.position.set(-45, 75, 35);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -110;
sun.shadow.camera.right = 110;
sun.shadow.camera.top = 110;
sun.shadow.camera.bottom = -110;
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(WORLD_CONFIG.worldSize * 2, WORLD_CONFIG.worldSize * 2),
  new THREE.MeshStandardMaterial({ color: 0x668b45, roughness: 1 }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(300, 32, 20),
  new THREE.MeshBasicMaterial({ color: 0x9bc8df, side: THREE.BackSide, fog: false }),
);
scene.add(sky);

function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], material: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function buildCave() {
  const group = new THREE.Group();
  group.position.set(PLACES.cave.pos.x, 0, PLACES.cave.pos.z);
  scene.add(group);

  const hill = new THREE.Mesh(
    new THREE.SphereGeometry(1, 40, 28),
    new THREE.MeshStandardMaterial({ color: 0x65734b, roughness: 1 }),
  );
  hill.scale.set(14, 8.5, 11);
  hill.position.set(0, 4.2, -1);
  hill.castShadow = true;
  hill.receiveShadow = true;
  group.add(hill);

  const entrance = new THREE.Mesh(
    new THREE.CircleGeometry(1, 40),
    new THREE.MeshBasicMaterial({ color: 0x090d0b, side: THREE.DoubleSide }),
  );
  entrance.position.set(0, 2.65, 9.45);
  entrance.scale.set(3.15, 4.1, 1);
  group.add(entrance);

  const stone = new THREE.MeshStandardMaterial({ color: 0x505344, roughness: 1 });
  // A short, walk-in tunnel with a visible back wall for the permanent marks.
  const tunnel = new THREE.Mesh(
    new THREE.CylinderGeometry(3.25, 3.25, 10, 32, 1, true, 0, Math.PI),
    stone,
  );
  tunnel.rotation.y = Math.PI;
  tunnel.rotation.z = Math.PI / 2;
  tunnel.position.set(0, 2.7, 5);
  tunnel.scale.set(1, 1, 1);
  group.add(tunnel);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 13), new THREE.MeshStandardMaterial({ color: 0x34382e, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.04, 3.3);
  group.add(floor);

  const wallCanvas = document.createElement("canvas");
  wallCanvas.width = 1024;
  wallCanvas.height = 512;
  const ctx = wallCanvas.getContext("2d")!;
  ctx.fillStyle = "#5b5b4c";
  ctx.fillRect(0, 0, wallCanvas.width, wallCanvas.height);
  for (let i = 0; i < 1800; i++) {
    const shade = 55 + Math.floor(Math.random() * 35);
    ctx.fillStyle = `rgba(${shade},${shade},${shade - 8},0.16)`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 512, 1 + Math.random() * 7, 1 + Math.random() * 5);
  }
  const wallTexture = new THREE.CanvasTexture(wallCanvas);
  wallTexture.colorSpace = THREE.SRGBColorSpace;
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 4),
    new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 1 }),
  );
  wall.position.set(0, 2.4, -2.5);
  group.add(wall);

  const warm = new THREE.PointLight(0xffbd75, 0.45, 15);
  warm.position.set(0, 3, 2);
  group.add(warm);

  return { group, wallCanvas, wallTexture };
}

function buildHouse() {
  const group = new THREE.Group();
  group.position.set(PLACES.house.pos.x, 0, PLACES.house.pos.z);
  scene.add(group);
  const plaster = new THREE.MeshStandardMaterial({ color: 0xc9b88e, roughness: 0.95 });
  const timber = new THREE.MeshStandardMaterial({ color: 0x594334, roughness: 1 });
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x806b50, roughness: 1 });
  box(group, [12, 0.35, 10], [0, 0.18, 0], floorMat);
  // Three walls leave the front open so the interior and beds remain visible.
  box(group, [12, 5.5, 0.35], [0, 2.9, -5], plaster);
  box(group, [0.35, 5.5, 10], [-6, 2.9, 0], plaster);
  box(group, [0.35, 5.5, 10], [6, 2.9, 0], plaster);
  box(group, [12.3, 0.3, 0.35], [0, 5.55, -5], timber);
  const roofA = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.35, 11), timber);
  roofA.position.set(-1.7, 6.1, 0);
  roofA.rotation.z = -0.38;
  roofA.castShadow = true;
  group.add(roofA);
  const roofB = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.35, 11), timber);
  roofB.position.set(1.7, 6.1, 0);
  roofB.rotation.z = 0.38;
  roofB.castShadow = true;
  group.add(roofB);

  const bedFrame = new THREE.MeshStandardMaterial({ color: 0x594334, roughness: 1 });
  const linen = new THREE.MeshStandardMaterial({ color: 0xd6d0bd, roughness: 1 });
  for (const x of [-3.2, 3.2]) {
    box(group, [3.1, 0.45, 4.2], [x, 0.55, -1.3], bedFrame);
    box(group, [2.95, 0.22, 3.9], [x, 0.88, -1.3], linen);
    box(group, [2.8, 0.38, 0.8], [x, 1.14, -2.65], new THREE.MeshStandardMaterial({ color: 0xe8dfc9, roughness: 1 }));
  }
  const lamp = new THREE.PointLight(0xffd39a, 1.1, 18);
  lamp.position.set(0, 4.5, 0);
  group.add(lamp);
  return group;
}

const cave = buildCave();
buildHouse();

/** Replace the cave-wall artwork whenever a new world snapshot arrives. */
export function setWallMarks(marks: Mark[]) {
  const ctx = cave.wallCanvas.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = "#5b5b4c";
  ctx.fillRect(0, 0, 1024, 512);
  marks.forEach((mark, index) => {
    const left = 40 + index * 490;
    if (mark.kind === "write") {
      ctx.fillStyle = "#e3d8bb";
      ctx.font = "24px Georgia, serif";
      const words = mark.content.slice(0, 300).split(/\s+/);
      let line = "";
      let y = 90;
      for (const word of words) {
        const next = line ? `${line} ${word}` : word;
        if (ctx.measureText(next).width > 420) {
          ctx.fillText(line, left, y);
          line = word;
          y += 34;
        } else line = next;
      }
      if (line && y < 480) ctx.fillText(line, left, y);
    } else {
      const palette: Record<string, string> = {
        ".": "#5b5b4c", r: "#b94c3d", g: "#537d45", b: "#426d9e", y: "#d7b84c",
        k: "#222321", w: "#e4dfcf", o: "#bd7942", p: "#9972a1", c: "#78aaa0",
      };
      const cells = mark.content.replace(/\s/g, "").slice(0, 576);
      const cell = 16;
      for (let i = 0; i < cells.length; i++) {
        ctx.fillStyle = palette[cells[i] ?? "."] ?? palette["."];
        ctx.fillRect(left + (i % 24) * cell, 48 + Math.floor(i / 24) * cell, cell, cell);
      }
    }
  });
  cave.wallTexture.needsUpdate = true;
}

let latestSnapshot: WorldSnapshot | undefined;
let worldTime = 0;
const ws = new WebSocket(`ws://${location.hostname}:${WORLD_CONFIG.server.port}${WORLD_CONFIG.server.path}`);
ws.onmessage = (event) => {
  try {
    const message = ServerMessage.safeParse(JSON.parse(event.data));
    if (message.success && message.data.type === "snapshot") {
      latestSnapshot = message.data.snapshot;
      setWallMarks(latestSnapshot.marks);
    }
  } catch (error) {
    console.warn("Ignored malformed world update", error);
  }
};
ws.onopen = () => console.info("Connected to the world.");
ws.onclose = () => console.info("World connection closed; rendering continues locally.");

const keys = new Set<string>();
let pointerLocked = false;
renderer.domElement.addEventListener("click", () => {
  if (!pointerLocked) renderer.domElement.requestPointerLock();
});
document.addEventListener("pointerlockchange", () => { pointerLocked = document.pointerLockElement === renderer.domElement; });
document.addEventListener("keydown", (event) => keys.add(event.code));
document.addEventListener("keyup", (event) => keys.delete(event.code));
document.addEventListener("mousemove", (event) => {
  if (!pointerLocked) return;
  camera.rotation.y -= event.movementX * 0.002;
  camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - event.movementY * 0.002, -1.45, 1.45);
});
window.addEventListener("blur", () => keys.clear());

const clock = new THREE.Clock();
const move = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  worldTime += delta;
  const phase = latestSnapshot?.timeOfDay ?? (worldTime / (WORLD_CONFIG.dayLengthMinutes * 60)) % 1;
  const daylight = THREE.MathUtils.clamp((Math.sin(phase * Math.PI * 2 - Math.PI / 2) + 0.12) / 0.8, 0.035, 1);
  const skyColor = new THREE.Color().setHSL(0.56, 0.38, 0.075 + daylight * 0.48);
  const groundColor = new THREE.Color(0x668b45).lerp(new THREE.Color(0x263b2b), 1 - daylight);
  scene.background = skyColor;
  sky.material instanceof THREE.MeshBasicMaterial && sky.material.color.copy(skyColor);
  scene.fog?.color.copy(skyColor);
  ground.material instanceof THREE.MeshStandardMaterial && ground.material.color.copy(groundColor);
  hemi.intensity = 0.12 + daylight * 1.2;
  sun.intensity = 0.08 + daylight * 2.1;
  sun.position.set(Math.cos(phase * Math.PI * 2) * 70, 12 + daylight * 70, Math.sin(phase * Math.PI * 2) * 70);

  move.set(0, 0, 0);
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  right.crossVectors(forward, camera.up).normalize();
  if (keys.has("KeyW") || keys.has("ArrowUp")) move.add(forward);
  if (keys.has("KeyS") || keys.has("ArrowDown")) move.sub(forward);
  if (keys.has("KeyD") || keys.has("ArrowRight")) move.add(right);
  if (keys.has("KeyA") || keys.has("ArrowLeft")) move.sub(right);
  if (keys.has("Space")) move.y += 1;
  if (keys.has("ShiftLeft") || keys.has("ShiftRight")) move.y -= 1;
  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar((keys.has("ControlLeft") ? 16 : 6) * delta);
    camera.position.add(move);
    camera.position.y = Math.max(0.8, Math.min(35, camera.position.y));
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
