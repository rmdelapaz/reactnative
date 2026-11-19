# Lab 2.3: three silent mistakes, made loud

Lesson 2.3 met three mistakes that fail without a word: a picture with no size, a plain SF Symbol name and content
under the phone's edges. This lab practices each one on new material (a beach picture, a table of terrain icons, a
"Sign up" bar pinned to the bottom of a screen), and lets a test or the type checker find it for you.

Setup: nothing to install (the shared lab install, `npm install` once in `shoreline/labs`). Open a terminal in
`starter/` and run `npm test` once as shipped: the failures are your to-do list. `fixtures/sites.json` is a real
answer of `GET /api/sites` from the course API (six beaches, each with an `image` of 1200 by 675).

## Task 1: a picture you can see and hear (src/SitePicture.tsx)

The picture renders and nothing complains, but it is 0 tall, and in the web preview it has no alt text. Give it
the size the lesson uses for the cards (no width: the card stretches it; an `aspectRatio` from the site's own
`image.width` and `image.height`), a Seafoam background for the frame while it loads, and describe it with
`accessibilityLabel` (plus `accessible`). Done when both Task 1 tests pass.

## Task 2: icons for every platform (src/terrainIcons.ts)

Two entries are wrong. `npm test` finds one: an entry that is only an SF Symbol name, which an iPhone draws and
Android and the web preview do not. `npm run typecheck` finds the other before anything runs: it reports two
errors, the table itself and `App.tsx` where the table is used (the same mistake seen from where it is used, as in
the lesson); read the end of the error in `src/terrainIcons.ts` (Did you mean), fix it, and both go. Fix both entries (the Material Symbol for rocky beaches is `landscape`). Done when the Task 2
test passes and `npm run typecheck` prints nothing after its two `>` lines.

## Task 3: a bar above the home indicator (src/SignUpBar.tsx)

The bar is pinned to the bottom of a screen, so no scroll view pads it. Use `useSafeAreaInsets()` from
`react-native-safe-area-context` (never React Native's own SafeAreaView) and add `insets.bottom` to the bar's
bottom padding of 16: the background still reaches the bottom of the glass, the button stays above the home
indicator. Done when both Task 3 tests pass (the tests hand the bar the insets of a phone with a home indicator,
34, and of one with a home button, 0).

## Done when

`npm test` says `Tests:       5 passed, 5 total`, and `npm run typecheck` and `npm run lint` print nothing after
their two `>` lines. Optional: `npm run web` with the API running shows the picture, an icon and the bar (the web
preview's insets are 0, so the bar keeps 16).
