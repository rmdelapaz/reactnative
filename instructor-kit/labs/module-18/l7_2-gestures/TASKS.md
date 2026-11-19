# Lab 7.2: far or fast, the right callback, and another way

New practice for Lesson 7.2 (not the queue project): the crew's gear shed lends litter grabbers and buckets, and a
loan row can be swiped to mark the gear returned. Work in `starter/` (the shared lab install has Gesture Handler,
Reanimated and their Jest setups: nothing to install).

Run in `starter/`: `npm test`, `npm run typecheck`, `npm run lint`. Jest has no finger: Gesture Handler's test helper
(`fireGestureHandler`) sends the pan's events as if one moved, and the tests wrap the list in a
`GestureHandlerRootView` (`src/testing.tsx`), as the app's root layout does. `npm run web` lets you drag a row with
the mouse (optional).

## Task 1: far OR fast (src/release.ts)

`shouldAsk(offset, velocityX)` decides, when the finger lets go, whether the row asks. Three tests describe the rule
from the lesson: a long slow pull asks, a short quick flick asks, a short slow drag does not. Fix the one operator.
Then read the comment about `'worklet'`: why does a function called from `onDeactivate` need it on a phone, when Jest
and the web preview run it either way?

## Task 2: the callback that never ran (src/SwipeToReturn.tsx)

A far swipe should ask "Has Theo brought it back?". It does not, and `npm run typecheck` says why (two errors: read
the first one). Rename the callback to its Gesture Handler 3 name.

## Task 3: a way that needs no gesture (src/LoanList.tsx)

A screen reader, a keyboard in the web preview, switch control or a gloved thumb cannot swipe. Give every loan a
visible Return button labeled `Return the litter grabber lent to Theo` (from the loan's own words) that leads to the
same question as the swipe. Nothing is marked returned without "Yes, returned".

Done when `npm test` says `Tests:       6 passed, 6 total`, and `npm run typecheck` and `npm run lint` print nothing
after their two `>` lines.
