# Session 18 labs: Animation and Gestures

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Every lab uses the
shared lab install (`npm install` once in `shoreline/labs`, Session 1): nothing to install here.

| Folder | What it is | Needs |
|---|---|---|
| `l7_0-catch-up/` | Starting with Part 3: set up the course code from `lesson-25-start.zip` and check it | the course downloads; the API running |
| `l7_1-animation-with-reanimated-4/` | a bar that glides, a dot that holds still for Reduce Motion, a counter with two classic mistakes | the shared install |
| `l7_2-gestures/` | far or fast, a swipe row with an old callback name, and the button every swipe needs | the shared install |

No phone, emulator or simulator is needed: Jest renders the components with Reanimated's and Gesture Handler's own
stand-ins for Jest (there is no UI thread in a terminal), `npm run typecheck` is `tsc --noEmit`, `npm run lint` is
`npx expo lint`. The tests check what your code ASKS for (which animation, which callback, which button); watching
it move is for `npm run web` and your phone. Nothing here changes `shoreline-crew`.
