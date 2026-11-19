# Session 21 labs: Testing Screens and Flows

The kit's `labs/` folder sits in your course folder (`shoreline/labs/`), with `npm install` done once in
`shoreline/labs` (Session 1). Work in the `starter/` folders; each `TASKS.md` says what to do and when you are done.
Run every command from the folder named in the task (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `checkpoint-3/` | Checkpoint 3 (Modules 7 and 8 so far): two code tasks; the written questions are in the workbook | the shared install |
| `l8_3-testing-screens-and-flows/` | you WRITE the tests: a counter by role and name, a list's three faces, two screens under Expo Router | the shared install |

No phone, emulator, simulator, shoreline-api or Metro is needed: Jest renders the components the way React Native
does (`npm test` runs once and exits), MSW answers the requests, `npm run typecheck` is `tsc --noEmit`, `npm run
lint` is `npx expo lint`. Nothing here changes `shoreline-crew`.
