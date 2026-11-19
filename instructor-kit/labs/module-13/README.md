# Session 13 labs: Storage and Mobile Forms

The kit's `labs/` folder lives in your course folder (`shoreline/labs/`), with the ONE shared install from
Session 1 (`npm install` once in `shoreline/labs`: nothing to install here). Work in the `starter/` folders;
`TASKS.md` in each lab says what to do and when you are done. Run every command from the folder named in the task.

| Folder | What it is | Needs |
|---|---|---|
| `l5_3-storing-data-on-the-device/` | saved preferences, SQL with `?` values, a database migration (Lesson 5.3) | the shared install |
| `l5_4-mobile-forms/` | a shift-report form: controlled fields, a comma as the decimal point, Next, Next, Go (Lesson 5.4) | the shared install |
| `checkpoint-2/` | Checkpoint 2 (30 minutes, alone): a route and its id, a query's states, favorites that open offline | the shared install |

No phone, no API and no server are needed: Jest renders the components the way React Native does, MSW answers the
requests with real shoreline-api answers saved in the lab, AsyncStorage runs on its package's own test copy, and
expo-sqlite runs on the SQLite engine built into Node 24 (the same SQLite a phone has; only the way JavaScript
reaches it differs). `npm test` runs the tests once, `npm run typecheck` is `tsc --noEmit`, `npm run lint` is
`npx expo lint`. Nothing here changes `shoreline-crew`.
