# Session 19 labs: Motion Polish and Accessible Apps

These folders sit in your course folder's `labs/` (`shoreline/labs/module-19/`). Nothing to install: they use the
shared lab install (`npm install` once in `shoreline/labs`, done in Session 1). Work in the `starter/` folders;
`TASKS.md` in each lab says what to do and when you are done. Run every command from the lab's `starter` folder.

| Folder | What it is | Needs |
|---|---|---|
| `l7_3-motion-polish/` | Lesson 7.3 on new material: a motion switch that only adds, a still twin for an animation, tags that make room | the shared install |
| `l8_1-accessible-mobile-apps/` | Lesson 8.1 on new material: one row = one target and one stop, announcements on iPhone, large text | the shared install |

No phone, emulator or simulator is needed: Jest renders the components the way React Native does (`npm test` runs
once and exits), `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. Tests cannot watch an
animation or listen to VoiceOver: they check what the code ASKS for (which animation, which label, which
announcement). Watching and listening stays on your phone, as in the lessons. Nothing here changes `shoreline-crew`.
