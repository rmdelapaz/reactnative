# Session 7 labs: Responsive, Platform-Specific and Themed UI

The kit's `labs/` folder lives in your course folder (`shoreline/labs/`, next to `shoreline-api/` and
`shoreline-crew/`), with `npm install` run ONCE in `shoreline/labs` (the shared lab install from Session 1: nothing
is installed inside a lab folder). Work in the `starter/` folder; `TASKS.md` says what to do and when you are done.
Run every command from the `starter` folder (VS Code: right-click it > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l2_5-responsive-platform-specific-and-themed-ui/` | a beach-tiles screen by day and by night and at any width: a palette TypeScript keeps complete, a contrast test, themed styles, columns from the window's width | the shared install |

No phone, emulator or simulator is needed: Jest renders the components the way React Native does, a test can switch
the phone to dark mode and resize the window (`npm test` runs once and exits); `npm run typecheck` is
`tsc --noEmit`, `npm run lint` is `npx expo lint`. `npm run web` shows the screen in the web preview (optional:
resize the browser window, and switch your computer or DevTools to dark mode). Nothing here changes
`shoreline-crew`, and nothing needs the API.
