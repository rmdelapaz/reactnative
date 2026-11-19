# Checkpoint 3: Modules 7 and 8 so far (30 minutes, on your own)

Two code tasks in `labs/module-21/checkpoint-3/starter`, then four written questions (W1 to W4) in your workbook.
Notes and the lesson pages are allowed; neighbors are not. The shared lab install is all you need (no phone, no
API, no Metro).

## C1: a cleanup row a screen reader can use (Lesson 8.1), about 10 minutes

`npm test -- src/c1.test.tsx`: four tests fail. They are the specification: change `src/CleanupRow.tsx` until they
pass, and do not edit the test file. The title is a heading; Join is a button whose name starts with the words on
it (`Join Tide Pool Morning Cleanup`); the wave is decoration; a full cleanup says `Full` and its Join button is
switched off.

## C2: tests for a swipe rule (Lessons 7.2 and 8.2), about 12 minutes

`src/swipe.ts` decides what happens when a finger lets go of a swipe-to-remove row: `remove` after a slow swipe of
at least 40 % of the row's width to the left, or a fling to the left at 800 points per second or faster; otherwise
`rest` (the row springs back). The code works. Write its tests in `src/c2.test.ts`, each named as a sentence. Your
tests should fail if anyone changes the rule: think about the edge (exactly 40 %), the speed limit, and which way
the finger went.

**Done when** `npm test` passes every test (the four C1 tests and yours), and `npm run typecheck` and `npm run lint`
print nothing after their two `>` lines. Hand in at the end of the 30 minutes: your `npm test` output and the two
files, the way your facilitator asks.
