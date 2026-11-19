# Session 20 labs: Testing the App's Logic

The kit's `labs/` folder sits in your course folder (`shoreline/labs/`) with its one shared install
(`npm install` once in `shoreline/labs`, done in Session 1). Work in the `starter/` folder; `TASKS.md` says what to
do and when you are done. Run every command from the folder named in the task.

| Folder | What it is | Needs |
|---|---|---|
| `l8_2-testing-the-apps-logic/` | Lesson 8.2's ideas on new code: tests that leak into each other, a native module's automatic stand-in, MSW answering with shoreline-api's own words | the shared install; no phone, no API, no Metro |

`npm test` runs Jest ONCE in a lab (the course app's own `npm test` watches; in `shoreline-crew` use
`npm test -- --watchAll=false`). `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. Nothing
here changes `shoreline-crew`. Every test runs in Node with stand-ins for the phone: they prove the code's decisions,
not what a real phone does.
