# Build order
1. Job 00 (alone).
2. Jobs 01, 02, 03, 05 in parallel.
3. Jobs 04, 06, 07, 08 against MOCK agents (no API calls).
4. Plug in real models; iterate on Job 09.
5. Jobs 10 and 11 throughout.
