# Session 24 labs: Updates, Monitoring and the App Stores

Copy the whole `labs/` folder into your course folder once (`shoreline/labs/`), if you have not already, and run
`npm install` once in `shoreline/labs` (the shared lab install). Work in the `starter/` folders; `TASKS.md` in each
lab says what to do and when you are done.

| Folder | What it is | Needs |
|---|---|---|
| `l9_3-updates-and-monitoring/` | Lesson 9.3 practice: which builds take an update, a crash reporter that hides personal data, a CI workflow to repair | the shared lab install |
| `l9_4-the-app-stores/` | Lesson 9.4 practice: a store-listing checker and privacy answers from a data inventory; plus `launch_check.mjs`, the launch-readiness check | the shared lab install; the check reads your `shoreline-crew` |

Both labs are plain TypeScript on Node (`npm test` runs `node --test`, `npm run check` runs `tsc --noEmit`). No
phone, no Expo account, no store account and no network: nothing here builds, publishes, submits or pushes.

**The launch-readiness check**, from your course folder `shoreline` (it changes nothing):

```
node labs/module-24/l9_4-the-app-stores/launch_check.mjs
```

It reads `shoreline-crew` (its Git repository, the CI workflow, `app.config.ts`, `eas.json`, the Your data facts)
and ends with READY, READY WITH NOTES or NOT READY. An Expo account is optional; store accounts are NOT required.
