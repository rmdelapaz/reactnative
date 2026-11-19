# Session 14 labs: Offline First and Permissions

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Run every command
from the lab's `starter` folder (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l5_5-offline-first/` | an outbox of beach hazard reports: a queue saved on the phone, a sender that sorts every answer, a Not sent yet list | the shared install |
| `l6_1-permissions-done-right/` | voice notes, asked politely: a permission as a step, a gate that explains before it asks, a panel that reads the answer again | the shared install |

Nothing to install: both labs use the shared install in `shoreline/labs` (`npm install` once, Session 1). No
phone, no API: Jest renders the components the way React Native does, MSW answers the requests the hazard
queue sends (a practice endpoint: shoreline-api has no hazard reports), and in the permissions lab a stand-in
module plays the phone's part, so the tests can answer Allow, Don't allow or "never ask again" on purpose.
`npm test` runs the tests once, `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`.
Nothing here changes `shoreline-crew`.
