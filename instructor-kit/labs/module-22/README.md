# Session 22 labs: Performance, Debugging and App Config

The kit's `labs/` folder lives in your course folder (`shoreline/labs/`), and `npm install` ran ONCE in
`shoreline/labs` (the shared lab install: nothing to install here). Work in the `starter/` folders; `TASKS.md` in
each lab says what to do and when you are done. Run every command from the `starter` folder of that lab.

| Folder | What it is | Needs |
|---|---|---|
| `l8_4-performance-and-debugging/` | The debugging method on a small beach-search screen: a test file that cannot even load, a bug a volunteer reported, a listener that outlives its screen | the shared lab install |
| `l9_1-app-config-and-environments/` | A typed `app.config.ts` for a second app, Shoreline Lookout: three variants, a misspelled key, the https guard, a Maps key from the environment | the shared lab install |

No phone, emulator or simulator is needed: Jest runs the screens headless, `npm run typecheck` is `tsc --noEmit`,
`npm run lint` is `npx expo lint`, and `npx expo config` prints what Expo sees (it runs on your computer, never on a
phone). Nothing here needs shoreline-api or an Expo account.
