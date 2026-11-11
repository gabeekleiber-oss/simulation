# Job 01: World renderer (client)
**Deliver:** Three.js scene: endless-feeling grassland, sky, day/night cycle driven by `timeOfDay`, a cave (hill, dark opening, interior with a wall that displays mark textures), a house (interior with beds, light). Nothing else in the world.
**Inputs:** `WorldSnapshot`. **Accept:** 60fps on a laptop; day/night looks good; interiors enterable; mark textures can be swapped at runtime via a function `setWallMarks(marks)`.


## Status
**Implementation added; acceptance verification pending.**
- Replaced the placeholder client with a Three.js grassland scene, sky, fog, and a day/night lighting cycle driven by the latest `WorldSnapshot.timeOfDay` (with a local fallback before the first snapshot).
- Added the cave hill, dark entrance, walk-in interior, textured back wall, and exported `setWallMarks(marks)` for runtime writing/drawing updates.
- Added the open-front house interior with beds and warm lighting.
- Added browser-only pointer-lock camera movement (WASD/arrows, mouse look, Space/Shift vertical movement, Ctrl speed boost). No camera state is sent over the WebSocket.
- **Not verified:** `pnpm --filter @world/client typecheck`, production build, browser performance, and the 60 FPS target. These require running the project; no local repository execution environment was available during this change.
