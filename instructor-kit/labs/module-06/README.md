# Session 6 labs: Touch and Input

The kit's `labs/` folder lives in your course folder (`shoreline/labs/`, next to `shoreline-api/` and
`shoreline-crew/`), with `npm install` run ONCE in `shoreline/labs` (the shared lab install from Session 1: nothing
is installed inside a lab folder). Work in the `starter/` folder; `TASKS.md` says what to do and when you are done.
Run every command from the `starter` folder (VS Code: right-click it > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l2_4-touch-and-input/` | the organizer's check-in desk: a button a finger can use, a number field, a switch, and taps that work while the keyboard is open | the shared install |

No phone, emulator or simulator is needed: Jest renders the components the way React Native does and React Native
Testing Library presses, holds and types like a finger (`npm test` runs once and exits); `npm run typecheck` is
`tsc --noEmit`, `npm run lint` is `npx expo lint`. What only a phone shows (the keyboard, the native switch, how a
target feels under a thumb) is in Lesson 2.4. `npm run web` shows the desk in the web preview (optional; Ctrl+C
stops it). Nothing here changes `shoreline-crew`, and nothing needs the API: `fixtures/` holds real answers.
