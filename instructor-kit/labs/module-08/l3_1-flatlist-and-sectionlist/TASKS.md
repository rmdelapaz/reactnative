# Lab 3.1: The beaches as a list

New practice on Lesson 3.1's ideas (not the lesson's Cleanups screen): the six beaches of `GET /api/sites` (real
answers in `fixtures/sites.json`) as a FlatList with a search field above them, the right words when the list has
no beaches, and the same beaches under their towns in a SectionList. Jest renders the lists the way React Native
does (no phone, no browser), and the tests in `src/lab.test.tsx` type and press like a finger.

**Setup:** nothing to install (the shared install in `shoreline/labs`). A terminal in
`labs/module-08/l3_1-flatlist-and-sectionlist/starter`, then `npm test`: seven tests fail. `npm run typecheck`
prints no error: every bug in this lab type-checks.

## Task 1: a list that keeps your typing and survives a wider window (src/BeachList.tsx)

Two tests, two of Lesson 3.1's Common Mistakes. Read each failure from the top. The first types `cove` into the
search field and finds only `c`: what is the header, a component or an element? The second widens the list from
one column to two and stops with an Invariant Violation whose message says the fix. Done when both Task 1 tests
pass. Did `npm run typecheck` or `npm run lint` ever complain?

## Task 2: three kinds of empty (src/BeachList.tsx)

Give the list a `ListEmptyComponent` chosen by `load.status` with the given components in `src/states.tsx`:
`Loading` with `Loading beaches…`, `Failed` with the message and `onRetry`, and `Empty` with
`No beaches match your search.` and a `Show all beaches` action that clears the search. The search field stays on
screen in every state (it is the list's header). Done when the three Task 2 tests pass.

## Task 3: beaches under their towns (src/towns.tsx)

Write `groupByTown(sites)` (towns in alphabetical order, each town's beaches in the order given) and make
`TownList` a `SectionList`: each beach's name, each town as a heading (`accessibilityRole="header"` and the
`styles.town` style, which has a background so a sticky heading covers the rows under it), sticky headings on every
platform. Done when `npm test` says `Tests:       7 passed, 7 total`, and `npm run typecheck` and `npm run lint`
print nothing after their two `>` lines.

**Optional:** `npm run web` shows both lists in the web preview (the switch groups them by town). Stop it with
Ctrl+C.
