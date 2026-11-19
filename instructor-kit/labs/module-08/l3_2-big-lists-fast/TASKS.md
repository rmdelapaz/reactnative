# Lab 3.2: Past cleanups, three at a time

New practice on Lesson 3.2's ideas (not the lesson's Cleanups screen): the PAST cleanups, which shoreline-api pages
like the upcoming ones (`GET /api/events?when=past&page=N&perPage=3`; the real pages are in `fixtures/`), on
FlashList. Jest renders the FlashList (with FlashList's own Jest setup, as the course app's tests do from Lesson
8.2), and MSW answers the requests instead of the API: it also counts which pages the code asked for.

**Setup:** nothing to install (the shared install in `shoreline/labs`). A terminal in
`labs/module-08/l3_2-big-lists-fast/starter`, then `npm test`: six tests fail. `npm run typecheck` prints no error.

## Task 1: a row that forgets when recycled (src/CleanupRow.tsx)

The test opens the first cleanup's report, then hands the SAME row component another cleanup, which is exactly
what FlashList does when it recycles a row. The report is still open, now under the wrong cleanup. Fix it with
FlashList's `useRecyclingState(initial, deps)`. Done when the Task 1 test passes.

## Task 2: a paging hook that asks once (src/usePastCleanups.ts)

`onEndReached` asks for the next page every time it is called: twice while page 2 is on its way, and again and
again after page 2 failed. Make it ask only when nothing is on its way and the last page did not fail (Try again,
`loadNextPage`, stays the way to ask after a failure). Then never show a cleanup twice: drop the items of the next
page whose `id` the list already has. Done when the three Task 2 tests pass; read the `asked` arrays in the
failures first: they are the requests MSW saw.

## Task 3: month headings in one FlashList (src/months.tsx)

Write `flattenByMonth` (a heading before the first cleanup of each month; `monthOf` is given) and
`headingIndices`, then give the FlashList `getItemType` (headings and cleanups in separate pools) and
`stickyHeaderIndices`. Done when `npm test` says `Tests:       6 passed, 6 total`, and `npm run typecheck` and
`npm run lint` print nothing after their two `>` lines.

**Optional:** `npm run web` shows the month list in the web preview (open a report and scroll). The browser's
console may show a yellow `useNativeDriver` warning from the pinned heading: harmless, as Lesson 3.2 says.
