# Part 2 project brief: Bookmobile Stops for the Tamarack County Library Bookmobile

## The client (fictional)

The **Tamarack County Library Bookmobile** is a library van. Every week it parks at eight stops in Tamarack County: a trailhead parking lot,
a senior center, two schools, a farmers market, a community hall, a mobile home park and a Saturday story corner on
a town green. Odile Varga, outreach librarian, runs it. Patrons keep asking her the same three things: where
and when is the van next, what is on board, and "can you bring me that book next time?" They ask from parking lots
and school yards, often with one bar of signal.

Odile wants a phone app, **Bookmobile Stops**:

- **Stops:** where the van parks and when (day and time), each stop on its own screen (a link to a stop opens it),
  and "Find my nearest stop" from where you are standing.
- **Books:** the collection, searchable by title or author, and which books are on the van this week.
- **Holds:** sign in with your library card and PIN, place a hold for pickup at a stop, and see your holds (ready
  at the stop, or requested). A hold placed with no signal must not be lost: it waits on the phone and goes out by
  itself when the signal is back, and sending it twice must never make two holds.
- **Account:** who is signed in, sign out, and "My stop", the stop you usually visit (remembered on the phone).

## What you are given

| | Given | You build |
|---|---|---|
| The API | `bookmobile-api/`: the library's server (`node server.ts`, port 4100; see its README) and its sample data | Nothing: never edit it |
| The app | An Expo SDK 58 + Expo Router project in `starter/`: the root layout, the Books and Account tabs, the sign-in modal, the not-found screen, the components, the hooks and the typed client | The 13 TODOs (TASKS.md), in the files that say TODO |
| The tests | `src/project.test.tsx`: the library's acceptance tests (25), run against the API's own code (MSW) | Nothing: they are the acceptance criteria (do not edit them); a test of your own is a plus |

## Requirements

- **R1 Routing and tabs** (Lessons 4.1, 4.2, 4.4 optional deep link): Four tabs (Stops, Books, Holds, Account) in a `(tabs)` group under one root stack; a stop's own screen at `/stops/[id]` that reads its id from the address and handles an unknown id; a not-found screen; links and `router` calls, never hand-built strings for ids. Optional: `bookmobilestops://stops/s03` opens a stop with the tabs underneath.
- **R2 Simple sign-in and a protected tab** (Lessons 4.3): Sign in with a library card number and a 4-digit PIN; the session kept with SecureStore on a phone (memory only in the web preview, as Lesson 4.3 says); the sign-in modal behind `Stack.Protected`; the Holds tab has a guest face (sign in) and a signed-in face; sign out from Account.
- **R3 Data from the mock API** (Lessons 5.1, 5.2): Every request through the typed client (`src/api/client.ts`); every answer checked by a guard before use; TanStack Query with the mobile managers; loading, error (with Try again), empty and the list on every data screen; pull to refresh (and a Refresh button for the web preview).
- **R4 Offline-safe storage** (Lessons 5.3, 5.5): Holds go into a persisted Zustand queue (AsyncStorage) with a `clientId` made once per hold on the phone, and are sent when the app is online (the same clientId twice is one hold: 201, then 200); refusals are kept with the server's words; "My stop" is a setting saved with AsyncStorage and checked when read back.
- **R5 The form and the device feature** (Lessons 5.4, 6.1, 6.3): The place-hold form with React Hook Form + Zod (a stop chosen, an optional note of up to 120 characters, the messages under the fields); "Find my nearest stop" with expo-location: it asks only after a press and an explanation, takes a no gracefully, and works in the web preview (the browser's location).
- **R6 Quality** (Lessons all): Types (no `any`, guards at the edges), accessibility labels on every control, `npx tsc --noEmit` clean, `npx expo lint` 0 problems, `npm test` all passing, `npx expo export` for web, android and ios, and a NOTES.md (how to run it, what you decided, what you would do next).

## Rules

- Alone or in pairs. Kicked off at the end of Session 16, checked in at Session 17, handed in **one week after
  Session 17**.
- Only the course's packages (the shared lab install has all of them): nothing to install.
- The web preview and Expo Go are enough; no developer account, no build, no store.
- Hand in: your project folder (without `node_modules`, `dist` and `.expo`), with a **NOTES.md**: how to run it,
  three decisions you made and why, what you would do next.

## How it is assessed

The rubric (RUBRIC.md): six rows, R1 to R6, each 0 (not yet), 1 (meets) or 2 (strong): 12 points, the scale of the
final project's rubric (Lesson 10.1). **Part 2 project complete = no row at 0** (the total is recorded; there is no other threshold).

**Part 2 met = the Bookmobile Stops project complete under its rubric (no row at 0) AND the Part 2 assessment met (14 or more of 20 points, 70 %).** Below either line: a written next step and one resubmission / retake within two weeks.
