# Lab 8.3: tests a volunteer would recognize (you write them)

New practice on Lesson 8.3's ideas, on three small pieces that are NOT the lesson's project: a bag counter, a
list of beaches that loads from the API, and two screens under Expo Router. The code in `src/` works; your job is
the tests. Find everything the way a screen reader meets it (role and name), press and type with `userEvent`,
wait with `findBy…`, and let MSW answer the requests (`src/test/server.ts`, with the course API's real answer in
`fixtures/sites.json`). Every `render`, `renderRouter` and `user.*` call gets an `await`.

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`). A terminal in
`labs/module-21/l8_3-testing-screens-and-flows/starter`, then `npm test`: seven tests fail, each with a `TODO`.
Run one file while you work: `npm test -- src/BagCounter.test.tsx`.

## Task 1: the bag counter, by role and name (src/BagCounter.test.tsx)

Three tests: no bags at the start and the button named `One bag fewer` disabled; two presses on `One more bag` give
`2 bags` and exactly two changes, 1 then 2 (`mock.calls`); the decorative ♻ is skipped by the queries (it is
`aria-hidden`) but there with `{ includeHiddenElements: true }`.

## Task 2: a list's three faces (src/BeachList.test.tsx)

Loading first, then the header `6 beaches` and `Pelican Point Beach, Port Marisol`; then the API answering 503 once
(`server.use(...)` with `{ once: true }`): the alert `Could not load the beaches (503).`, a press on `Try again`, and
the six beaches.

## Task 3: two screens under the router (src/screens.test.tsx)

`renderRouter(routes)` with the route list in the file: press the link named `Open Tide Pool Morning Cleanup`, then
`expect(screen).toHavePathname('/cleanups/e17')` and the meeting point. Then start at `/cleanups/e99`
(`{ initialUrl: ... }`) and expect the alert `No such cleanup: e99`. Import `screen` and `userEvent` from
`@testing-library/react-native`, only `renderRouter` from `expo-router/testing-library` (Lesson 8.3, Common
Mistakes: `npm run typecheck` tells you why).

**Done when** `npm test` says `Tests:       7 passed, 7 total` and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines.

**Then prove your tests.** A test that never fails proves nothing. Each `debug_*` file next to this sheet is a
working file with a planted bug. Copy one over the file it names (for example `debug_BagCounter.tsx` over
`starter/src/BagCounter.tsx`), run `npm test`, and check that at least one of your tests fails and that its
message points at the bug. Put the working file back afterward (it is in `solution/src/`, or undo the copy in your
editor).
