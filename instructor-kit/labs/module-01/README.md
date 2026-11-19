# Session 1 labs: How React Native Works and Your Toolchain

Copy the whole `labs/` folder into your course folder once (`shoreline/labs/`, next to `shoreline-api/` and
`shoreline-crew/`). Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done.
Run every command from the folder named in the task (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l1_0-orientation/` | `check_environment.mjs` (is your computer ready?) and the diagnostic practice | the course folder; the API running for the check |
| `l1_1-how-react-native-works/` | React Native's building blocks, tested without a phone | the shared install (below) |
| `l1_2-your-toolchain/` | what runs your code and what checks it, plus a debug handout | the shared install; the API running for the handout |

No phone, emulator or simulator is needed for any lab: Jest renders the components the way React Native does
(`npm test` runs once and exits), `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`.
`npm run web` shows a lab's components in the web preview if you want a look (optional; stop it with Ctrl+C).
**One install for every lab of the course:** `npm install` once in `shoreline/labs` (this folder's parent, the one
with `package.json`). It downloads Expo, React Native, the course app's libraries, Jest and TypeScript into
`shoreline/labs/node_modules` (about 1,400 packages, 1.1 GB, a minute or two); every lab finds them there, so you
never run `npm install` inside a lab folder. Nothing here changes `shoreline-crew`.
