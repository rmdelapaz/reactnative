# Lab 4.2: A tab bar in a group, a stack around it, and a modal

The beach sites again, now shaped like Lesson 4.2's Shoreline Crew: a `(tabs)` group with three tabs (Sites,
Saved, Guide) inside the root stack (`app/_layout.tsx`), a site's screen that opens on top of the tabs, and a
tide safety card presented as a modal (`app/tide-safety.tsx`). The tab bar is Expo Router's JavaScript tabs,
`expo-router/js-tabs`, as in the lesson. Never the lesson's own project: different tabs, a different modal.

Work in `starter/`; the shared install in `shoreline/labs` has every package. `npm test` builds the app from
`app/` and presses its buttons (no phone, no browser); `npm run typecheck` and `npm run lint` check it.

Run `npm test` as shipped: five tests fail, one passes (Done from the Guide tab already works), and the
starter type-checks and lints clean. Navigation mistakes rarely
stop an app: it runs and shows something odd. In Metro's terminal you would see yellow `[Layout children]`
warnings for two of the three bugs; here, look for `console.warn` in the test output.

## Task 1: The missing tab

The bar should show Sites, Saved and Guide. One tab is missing, and the warning names the files that exist. Fix
the layout, not the file. Done when both Task 1 tests pass.

## Task 2: A header called "(tabs)"

The Sites list moved into the group, but the root layout still names `index`. Two tests fail: a header bar titled
`(tabs)` sits above the tabs, and a site's back button would show "(tabs)" too. Name the group's route, hide its
header (`headerShown: false`), and set `headerBackTitle: 'Back'` in the root stack's `screenOptions`. Done when
both Task 2 tests pass.

## Task 3: Done, however the modal was opened

From the Guide tab, Tide safety opens the modal and Done closes it. Opened from its address (a link, the web
preview's address bar) nothing is underneath, and `router.back()` cannot go anywhere: write `done()` the way
Lesson 4.2's Before you go does. Done when `npm test` says `Tests:       6 passed, 6 total`, and
`npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

Stretch (no test): which edges would each screen keep with a real `Screen` component (Lesson 4.2's edges table):
the Sites tab (no header), Saved and Guide (a tab header), a site and the modal (the stack's header)?
