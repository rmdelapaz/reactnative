# Lab 8.4: Performance and Debugging (the debugging method, on a new screen)

A small screen for crew leaders, `SiteSearch`: type part of a beach's name, then set a low-tide reminder for one.
The six beaches in `src/data/sites.json` are a real answer of shoreline-api's `GET /api/sites` (trimmed to id, name
and town). This lab is the method of Lesson 8.4 on code you have not seen: reproduce, read the error, narrow it
down, fix one thing, keep a test that fails without the fix. Nothing to install (the shared lab install in
`shoreline/labs`), no phone, no API. Work in `starter/`.

## Task 1: a test file that cannot even load (10 min)

1. `npm test -- src/SiteSearch.test.tsx`. No test runs: `Test suite failed to run`, with a `TypeError`.
2. Read it all, slowly: the message, then the stack from the bottom up. Which of YOUR files does the chain go
   through, and which line of which file runs the code that breaks?
3. That module is at the edge of what these tests are about (a reminder, not the search). Replace it with a
   stand-in where `TODO 1` says: `jest.mock('./reminders', () => ({ remindMe: jest.fn(async () => 'reminder-1') }))`.
   Why a factory? Without one, Jest loads the real module to copy its shape, and the same error comes back.

Done when: three tests pass and one fails with `TODO 2`.

## Task 2: "I typed cove and nothing came up" (15 min)

The report, word for word: "I typed cove and nothing came up, but the beach is called Driftwood Cove!"

1. **Reproduce it first, in a test.** Replace the `TODO 2` test's body: type `cove` into the field labeled
   "Search beaches", then expect `Driftwood Cove` and `1 beach` (Task 1's second test shows how). Run it and watch it
   fail for the volunteer's reason (`Unable to find an element with text: Driftwood Cove`).
2. **Narrow it down.** The data is right (the JSON has Driftwood Cove) and the screen draws what it is given, so
   the bug is in what the screen keeps: read `matchingSites`.
3. **Fix one thing** in `src/SiteSearch.tsx`, and run the file again: four passed.

Done when: `npm test -- src/SiteSearch.test.tsx` says `Tests:       4 passed, 4 total`, and you can say why the
new test is a test of THIS bug (it failed before the fix).

## Task 3: a listener that outlives its screen (10 min)

`src/useOnForeground.ts` refreshes a screen each time the app comes back to the foreground. Lesson 8.4's first
cause of memory leaks: a listener that is never removed. Every visit to the screen adds one more.

1. `npm test -- src/useOnForeground.test.tsx`: one test passes, `stops listening when the screen closes` fails.
2. Keep what `AppState.addEventListener` returns and give the effect a cleanup (`TODO 3`).

Done when: `npm test` says `Tests:       6 passed, 6 total`, and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines.

## Questions for the debrief

- Task 1: which line of the stack was the first one in YOUR code, and why is a stand-in the right fix here and not
  a change to `reminders.ts`?
- Task 2: what would have happened if you had fixed `matchingSites` first and written the test afterwards?
- Task 3: where would you see this leak on a phone? (Lesson 8.4: the performance monitor's memory number, or a
  heap snapshot before and after opening the screen many times.)
