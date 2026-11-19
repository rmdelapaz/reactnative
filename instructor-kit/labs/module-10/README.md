# Session 10 labs: File-Based Routing, Tabs and Modals

The kit's `labs/` folder sits in your course folder (`shoreline/labs/`, next to `shoreline-api/` and
`shoreline-crew/`), with `npm install` run ONCE in `shoreline/labs` (the shared install from Session 1: every lab
of the course finds its packages there; nothing is installed inside a lab folder). Work in the `starter/` folders;
`TASKS.md` in each lab says what to do and when you are done.

| Folder | What it is | Needs |
|---|---|---|
| `l4_0-starting-with-part-2/` | Starting the course at Part 2: the course code at the start of Lesson 4.1, set up and checked | the course download `lesson-11-start` and the API running |
| `l4_1-file-based-routing/` | Routes from files, params, leaving a screen, a not-found screen | the shared install |
| `l4_2-tabs-nesting-and-modals/` | A tab bar in a group inside a stack, and a modal | the shared install |

No phone, emulator or simulator is needed. The two routing labs keep their screens in an `app/` folder, exactly
like `src/app` in Shoreline Crew, and `npm test` builds a real Expo Router app from that folder with Expo Router's
own testing library (`expo-router/testing-library`), opens it at an address and presses its buttons. `npm run
typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. Nothing here changes `shoreline-crew`.

One difference from the course app: a lab has no Metro running, so nobody writes typed routes for it
(`.expo/types/router.d.ts`). The labs therefore write a screen's params out, `useLocalSearchParams<{ id: string
}>()`; in Shoreline Crew you name the route instead, `useLocalSearchParams<'/cleanups/[id]'>()`, and Metro's types
check every link.
