# Job 10: Visitor camera & dev panel
**Deliver:** walk/fly camera for the human visitor (client-only, never sent to the server); toggleable dev panel showing each agent's private thoughts, memory tiers, actions, provider and latency; pause, speed control, replay of logged events.
**Rules:** visitor camera position must NOT be transmitted. Dev panel receives `DevEvent`s over a separate channel that agents can never reach.
**Accept:** network inspection shows no visitor data sent to the server.
