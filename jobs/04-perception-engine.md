# Job 04: Perception engine
**Deliver:** `buildObservation(world, agentSlot)` -> plain first-person text: field-of-view cone, distances in "steps", left/right/ahead/behind, hearing radius for `say`, body state (tired, standing, lying), what the cave marks look like (text or coarse grid) when inside.
**Rules:** no banned words (see AGENTS.md); never includes anything about the visitor; others are "another one like you".
**Accept:** snapshot tests; banned-word lint passes; visitor presence changes nothing.
