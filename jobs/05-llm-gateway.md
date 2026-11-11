# Job 05: LLM gateway
**Deliver:** adapters for Gemini, NVIDIA NIM, OpenRouter; multi-key rotation; per-provider rate limiter; 10s hard timeout; failover order from config; JSON extraction/repair; structured request logging (latency, provider, tokens); a `MockProvider` returning random valid actions.
**Interface:** `complete({system, input, maxTokens, temperature}) => Promise<string>`.
**Accept:** works against each provider with real keys; simulated 429s and timeouts fail over; never exceeds configured RPM.
