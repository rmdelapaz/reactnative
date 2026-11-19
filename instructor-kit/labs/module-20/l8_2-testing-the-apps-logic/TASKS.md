# Lab 8.2: Testing the App's Logic (headless: no phone, no API, no Metro)

New practice on Lesson 8.2's ideas, on three small pieces of code that are not part of Shoreline Crew's own
suite: a store that keeps state in a module, a native module with no phone under it, and the API's answers played
back by MSW. The code in `src/gearShed.ts`, `src/draft.ts` and `src/signUp.ts` is right: **every task is a fix to a
test file.** That is the lesson's question, practiced three times: is the app wrong, or is the test setup wrong?

Uses the shared lab install (`npm install` once in `shoreline/labs`, Session 1): nothing to install here. A terminal
in `labs/module-20/l8_2-testing-the-apps-logic/starter`, then `npm test` (Jest runs once). As shipped:
`Tests:       7 failed, 3 passed, 10 total`.

## Task 1: tests that depend on the test before them (`src/gearShed.test.ts`)

Run `npm test -- -t "refuses"`: the one test passes alone. In the full run it fails, and so does "starts the day
with everything on the shelf". Why? The store is a module, and nothing empties it between tests. Add ONE
`beforeEach` above the tests that puts the store back the way `create()` made it (Zustand's `getInitialState()`, as
Lesson 8.2 resets the log queue). Do not change the tests' order or `gearShed.ts`. Done when the three gear-shed
tests pass in the full run.

## Task 2: an empty stand-in answers undefined (`src/draft.test.ts`)

`jest.mock('expo-secure-store')` turns every function into an empty `jest.fn()`. Read the two failures from the
top: one is `Cannot read properties of undefined (reading 'catch')` with a stack pointing into `draft.ts`, the other
gets `null` back. The app is fine: on a phone, `setItemAsync` always returns a Promise and `isAvailableAsync` says
`true`. In a `beforeEach`, give `secureStore.isAvailableAsync` and `secureStore.setItemAsync` those answers with
`mockResolvedValue`. Done when the three draft tests pass, and `npm run typecheck` is still clean (that is what
`jest.mocked()` is for).

## Task 3: the API's own words, through MSW (`src/signUp.test.ts`)

`src/fixtures/signups.json` holds four answers the real shoreline-api gave to `POST /api/events/:id/signups`. The
server's default handler says yes. Replace each `todo(...)` line with a `server.use(...)` override for that one test
(they are undone after each test by `server.resetHandlers()`): 3a answers `answers.alreadySignedUp.body` with
status 409, 3b `answers.signInEnded.body` with 401, 3c fails like a dropped connection (`HttpResponse.error()`).
Then delete the `todo` function. Done when `npm test` says `Tests:       10 passed, 10 total`, and
`npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Stretch 1:** one more test, for the cleanup that is over (`answers.closed`): which outcome, and which words?
No change to `signUp.ts` is needed.

**Stretch 2: a broken setup in the real app.** Unzip `lesson-29-end.zip` from the course downloads into a scratch
folder (not your own `shoreline`), `npm ci` in its `shoreline-crew`, and run `npm test -- --watchAll=false`: 28
tests pass. Copy `debug_jest.setup.ts` from this lab over its `jest.setup.ts` and run the suite again. Which files
fail, what is the first line of the message, and which of Lesson 8.2's Common Mistakes is it?
