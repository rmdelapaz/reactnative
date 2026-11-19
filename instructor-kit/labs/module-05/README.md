# Session 5 labs: Images, Icons, Fonts and Safe Areas

The kit's `labs/` folder lives in your course folder (`shoreline/labs/`, next to `shoreline-api/` and
`shoreline-crew/`), with `npm install` run ONCE in `shoreline/labs` (the shared lab install from Session 1: nothing
is installed inside a lab folder). Work in the `starter/` folder; `TASKS.md` says what to do and when you are done.
Run every command from the `starter` folder (VS Code: right-click it > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l2_3-images-icons-fonts-and-safe-areas/` | three mistakes that fail silently on a phone (a picture with no size, a plain SF Symbol name, a bar under the home indicator), made loud by a test or by tsc | the shared install |

No phone, emulator or simulator is needed: Jest renders the components the way React Native does (`npm test` runs
once and exits), `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. `npm run web` shows the
lab's screen in the web preview if you want a look (optional; the pictures come from `shoreline-api`, so start it
first in its own terminal; stop the preview with Ctrl+C). Nothing here changes `shoreline-crew`.
