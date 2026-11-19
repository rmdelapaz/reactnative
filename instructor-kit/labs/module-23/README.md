# Session 23 labs: Development Builds and EAS Build

Work in the `starter/` folder; `TASKS.md` says what to do and when you are done. Run every command from the
folder named in the task (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l9_2-development-builds-and-eas-build/` | Build profiles checked on your computer before a cloud build is spent: `extends`, a profile checker for `eas.json`, and "new build or just Metro?" as code | the shared lab install (`npm install` once in `shoreline/labs`) |

**No Expo account, no EAS command and no phone are needed for this lab.** It is plain TypeScript: Node runs the
`.ts` files, `npm test` runs the tests (`node --test`), `npm run check` is `tsc --noEmit`. The app in it,
Rockpool Survey, is a made-up tide-pool counting app with the same three variants as Shoreline Crew (Dev,
Preview, the store app), so nothing here changes `shoreline-crew`.
