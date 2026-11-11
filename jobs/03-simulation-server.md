# Job 03: Simulation server
**Deliver:** authoritative 20Hz tick; execute queued movement (toward named targets or directions), collisions with cave/house, enter/exit triggers, sleeping and tiredness, 25-30 min random lifespans, fade-out death, respawn near the house with new `lifeId`, world clock, WS broadcast of `WorldSnapshot`.
**Rules:** the visitor is never represented. Bodies keep doing the last action if no new action arrives.
**Accept:** headless run with random walkers for 1h simulated stable; lifespans/respawns correct; tests.
