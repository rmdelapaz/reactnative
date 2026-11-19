# Lab 4.1: Routes from files, params, and the way back

A small app of Shoreline Crew HQ's beach sites, built the way Lesson 4.1 builds the cleanup screen: the files in
`app/` are the routes (`app/index.tsx` is `/`, a file `app/sites/[id].tsx` would be `/sites/<id>`), the root
layout `app/_layout.tsx` is a Stack, and `fixtures/sites.json` is a real answer of `GET /api/sites` (no API
needed). Never the lesson's own project: here it is beaches, not cleanups.

Work in `starter/`, with a terminal in that folder (the packages come from the shared install in
`shoreline/labs`). `npm test` builds a real Expo Router app from `app/` with Expo Router's testing library and
opens it at an address; `npm run typecheck` is `tsc --noEmit`; `npm run lint` is `npx expo lint`.

Run `npm test` as shipped: one test passes (the list and its back button) and six fail. Read the first failure
from the top, and the yellow `console.warn` above it: the layout names a route the folder does not have. Then
`npm run typecheck`.

## Task 1: A route in the right place

Pressing Open on Driftwood Cove goes to `/sites/driftwood-cove`, and the app shows Expo Router's "Unmatched
Route" page: no file in `app/` matches that address. The site's screen is in `app/site/[id].tsx`. Move it to the
folder the address names (keep the square brackets; in a terminal, put the path in quotes). Then the type error:
`useLocalSearchParams()` without a type gives `string | string[] | undefined`. Give it this route's params,
`useLocalSearchParams<{ id: string }>()`. (In Shoreline Crew you name the route instead,
`useLocalSearchParams<'/cleanups/[id]'>()`: Metro writes those types. No Metro runs in a lab.)
Done when the three Task 1 tests pass and `npm run typecheck` prints nothing after its two `>` lines.

## Task 2: A site that does not exist

`/sites/seal-rock` is a good address for an id that names no beach (Seal Rock is a town). The screen shows
nothing at all. Show `No beach site has the id seal-rock.` (with the real id) and the `BackButton` already in the
file, whose press calls a `leave()` you write: `router.back()` when `router.canGoBack()`, otherwise
`router.replace('/')`. Opened from its address there is nothing underneath, and the list must take the dead end's
place. Done when the three Task 2 tests pass.

## Task 3 (stretch): Not on the map

`/site/pelican-point` (no s) matches no file: Expo Router shows its own page. Create `app/+not-found.tsx` with a
heading (`accessibilityRole="header"`) "This page is not on the map", a sentence, and a "Back to the sites"
button that is a `Link` to `/` with `replace` and `asChild` around a `Pressable` with `accessibilityRole="button"`.
The layout already gives it the title "Not found". Done when `npm test` says `Tests:       7 passed, 7 total`,
and `npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

Debrief: which of the three problems did tsc find, which only a test (or a volunteer) found, and why does
`replace` matter on the two "back to the sites" buttons?
