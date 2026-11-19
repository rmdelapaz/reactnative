# Lab 5.2: the cache on a phone

New practice on Lesson 5.2's ideas, on a list the course app does not have: the PAST cleanups, three at a time, with a
Load more button. The list component (`src/PastCleanups.tsx`) and the request (`src/api.ts`) are given; you write the
three pieces a phone needs around TanStack Query. MSW answers like shoreline-api from `fixtures/past.json` (the API's
real answer: seven past cleanups), with the totals in the `X-Total-Count` and `X-Total-Pages` headers.

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`). Then a terminal in
`labs/module-12/l5_2-tanstack-query-on-mobile/starter` and `npm test`: all five tests fail. Read the first message
from the top: it is the one Lesson 5.2's Common Mistakes quotes.

## Task 1: the provider (src/Providers.tsx)

Every `useQuery` and `useInfiniteQuery` looks for its cache in a `QueryClientProvider`. Make `Providers` give its
children the `client` it receives. Done when the Task 1 test passes (and, because the list renders now, the other
tests fail for their own reasons). Did `npm run typecheck` complain about the missing provider? Why not?

## Task 2: the connection, from a NetInfo-shaped source (src/online.ts)

`connectOnlineManager(source)` gets a function shaped like `NetInfo.addEventListener`: it calls a listener with
`{ isConnected }` on each change and returns "stop listening". Hand it to `onlineManager.setEventListener`, with
`isConnected !== false` as "online" (null means not known yet). Done when both Task 2 tests pass: offline, the query
is **paused** (no request at all, and the list says "Waiting for a connection…"); online again, it carries on by
itself. (`App.tsx` shows the real call: `connectOnlineManager(NetInfo.addEventListener)`, on a phone only.)

## Task 3: the next page (src/queries.ts)

`getNextPageParam` decides whether there is a page after the last one loaded. Return `lastPage.page + 1` while
`lastPage.page < lastPage.totalPages`, else `undefined`. Done when `npm test` says `Tests:       5 passed, 5 total`,
and `npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Think about it:** the last test refetches the list with two pages loaded. Which pages does TanStack Query ask
for, and why does the list not shrink back to three? Where would the screen's pull-to-refresh spinner come from?

**Optional:** `npm run web` shows the list in the web preview against your own API (`node server.ts` in
`shoreline-api`; the browser's offline switch in DevTools plays airplane mode).
