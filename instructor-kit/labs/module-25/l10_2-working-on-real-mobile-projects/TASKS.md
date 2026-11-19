# Lab 10.2: estimates, version drift and release trains, as code

New practice on three of Lesson 10.2's habits, in plain TypeScript (no phone, no app): give a range instead of one
number, read `npm outdated` with the Expo SDK in mind, and know which release train a change can catch. Each is a
small function with tests, so the habit has a definition you can argue with.

**Setup:** a terminal in `labs/module-25/l10_2-working-on-real-mobile-projects/starter` (the shared lab install:
nothing to install). `npm test` runs every `*.test.ts` file; `npm run check` is `tsc --noEmit`.

## Task 1: a range, from a breakdown (estimate.ts)

`WorkKind` is the lesson's "work phones add" table as a union, and `reminders` its `Record`: a checklist the type
checker keeps complete. Write `threePoint()` ((optimistic + 4 × likely + pessimistic) ÷ 6), `total()` (the sums of
the three columns and their three-point estimate), `forgotten()` (the kinds of work with no part yet, in the
checklist's order) and `sayRange()` (the sentence you say to the client). The tests use the lesson's own example
numbers ("for illustration"): 5.5, 10 and 19 hours, about 11. Done when the four Task 1 tests pass.

## Task 2: pinned, update or later (outdated.ts)

`shoreline-outdated.ts` holds the lesson's own `npm outdated` card and Expo SDK 58's version table for the course
app's native packages. Write `classify()`: a package the SDK's table lists is **pinned** (`npx expo install` picks
its version, never "Latest"); otherwise a new major version is **later** (read the release notes first; while a
version starts with 0, a new minor counts as a new major), and anything else is an **update** on a branch with CI.
Then `report()`. Done when the three Task 2 tests pass.

## Task 3 (stretch): which train? (train.ts)

Write `departure()`: merged by the cut-off, a change leaves on this train; after it, a JavaScript-only fix can go as
an update between trains, and a native change or a feature waits for the next train. Done when `npm test` says
`ℹ pass 10` and `ℹ fail 0`, and `npm run check` prints nothing after its two `>` lines.
