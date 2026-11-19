# Checkpoint 2: Modules 4 and 5 so far (30 minutes, alone)

Three small pieces of a beach-sites app that use what Modules 4 and 5 taught so far: a route and its address
(Lessons 4.1 and 4.4), a query's states (Lessons 5.1 and 5.2), and data kept on the phone that opens with no
connection (Lessons 5.2 and 5.3). Lesson pages and your own `shoreline-crew` are allowed; a neighbor's code is not.
It is not graded: it tells you which lesson to revisit before Session 14.

**Setup:** a terminal in `labs/module-13/checkpoint-2/starter` (the shared lab install: nothing to install). Run
`npm test`: 6 of the 7 tests fail (the first run takes up to a minute while Jest prepares Expo Router once). No API
and no phone: MSW answers with real shoreline-api answers (`src/fixtures/`), and the tests render the two routes
the way the files `src/app/index.tsx` and `src/app/sites/[id].tsx` would give them.

## Task 1: the route and its address (src/app/sites/[id].tsx, src/app/index.tsx), about 8 minutes

a. A link (or a deep link) to `/sites/driftwood-cove` opens the site's screen, which never finds its site: read
   the file's name, then the name the screen asks `useLocalSearchParams` for.
b. Pressing a site in the list goes to the wrong address. Use the typed-routes form of the address,
   `{ pathname: '/sites/[id]', params: { id } }`, as the course does.

## Task 2: every state of a screen that reads the network (src/SiteDetails.tsx), about 10 minutes

When the request fails, the screen says "Loading the site…" for ever. Show the API's sentence (`describeError`)
and a **Try again** button that asks again (the query's `refetch`).

## Task 3: favorites kept on the phone (src/favorites.ts, src/queries.ts), about 10 minutes

a. `readFavorites()` trusts what was saved: check it like API data (a list of `{ id, name }`; anything else, or
   text that is not JSON, gives no favorites and a `console.warn`). It never rejects.
b. With no connection the favorites never open: the query waits for a network it does not need.

**Done when** `npm test` says `Tests:       7 passed, 7 total` and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines. Write your last `npm test` summary line in your workbook.
