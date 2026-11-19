# Session 11 labs: Sign-In Flows and Deep Links

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Run every command
from the lab's `starter` folder (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l4_3-sign-in-flows-and-protected-routes/` | a session store and its hook, a saved copy in secure storage, guarded screens | the shared install |
| `l4_4-deep-links/` | old links rewritten safely, sharing a link with a fallback, the anchor, links that only open | the shared install |

Nothing here needs a phone, the API or Metro: Jest renders the screens the way React Native does (expo-router's
`renderRouter` builds a real Expo Router stack from the components a test hands it, at any address), secure storage
and the share sheet are stood in for inside the tests (Jest has no keychain and no share sheet), and MSW answers
the few requests a screen makes. `npm test` runs once and exits, `npm run typecheck` is `tsc --noEmit`, `npm run
lint` is `npx expo lint`. The packages come from the course's one lab install (`npm install` once in
`shoreline/labs`, done in Session 1); never run `npm install` inside a lab folder. Nothing here changes
`shoreline-crew`.
