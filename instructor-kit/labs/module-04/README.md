# Session 4 labs: Flexbox the Native Way

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Everything uses the
course's one lab install (`npm install` once in `shoreline/labs`, done in Session 1): nothing to install here, and
no phone or API is needed.

| Folder | What it is |
|---|---|
| `l2_2-flexbox-the-native-way/` | a beach's info panel: a header row, label/value rows and a wrapping row of tags |
| `checkpoint-1/` | Checkpoint 1 (Modules 1 and 2 so far): a type guard, a web card rebuilt for the phone, its layout and the checks (30 minutes, on your own) |

`npm test` runs Jest once (it renders the components the way React Native does and reads their styles),
`npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. Jest cannot measure a layout: the tests
check the flexbox styles you give each box, and `npm run web` shows the result in the web preview (optional; stop it
with Ctrl+C). Remember from Lesson 2.2 that the web preview can hide a row of text that would run off a phone's
screen. Nothing here changes `shoreline-crew`.
