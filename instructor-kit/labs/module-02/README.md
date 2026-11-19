# Session 2 labs: From the HQ to the Phone

The kit's `labs/` folder sits in your course folder (`shoreline/labs/`), with the one shared install from Session 1
(`npm install` once in `shoreline/labs`). Work in the `starter/` folder; `TASKS.md` says what to do and when you are
done. Run every command from the folder named in the task.

| Folder | What it is | Needs |
|---|---|---|
| `l1_3-from-the-hq-to-the-phone/` | code copied from a web app, made fit for a phone: browser APIs the type check accepts, the error a phone's fetch throws, the API address read the Expo way | the shared install (no API, no phone) |

No phone, emulator or simulator is needed: Jest renders the component the way React Native does, MSW answers the
requests instead of shoreline-api (with real answers saved from it in `fixtures/`), `npm run typecheck` is
`tsc --noEmit`, `npm run lint` is `npx expo lint`. Nothing here changes `shoreline-crew`.
