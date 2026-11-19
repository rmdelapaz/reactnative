# Lab 2.2: a beach's info panel, laid out the native way

New practice on Lesson 2.2's layouts (not the lesson's own EventCard): a header row, label/value rows and a
wrapping row of chips, on a panel about one of the crew's beaches. `fixtures/sites.json` is a real answer of the
course API (`GET /api/sites`). Jest renders the panel the way React Native does but cannot measure it, so the tests
in `src/lab.test.tsx` read the flexbox styles you give each box; `npm run web` shows what they do.

**Setup:** the course's one lab install (done in Session 1). A terminal in
`labs/module-04/l2_2-flexbox-the-native-way/starter`, then `npm test`: all five tests fail (the panel
test needs Task 3's function).

## Task 1: a header row (src/SiteHeader.tsx)

The beach's name on the left, the town pushed to the right edge, the two lined up through their middles. Which
property turns the column into a row, which pushes the town to the end (main axis), which lines them up (cross
axis)? The name shares its row with the town: should it get `flex: 1` or `flexShrink: 1`, and why? Done when the
Task 1 test passes.

## Task 2: label and value (src/FactRow.tsx)

Give the label a fixed width of 88 so every value starts at the same place, and let the value take the rest of the
row and wrap inside it. Then run `npm run web` (optional) with and without your value style: does the web preview
show the difference? Lesson 2.2 says why it may not, and what a phone does. Done when the Task 2 test passes.

## Task 3: a wrapping row of tags (src/TagRow.tsx)

(a) Write `siteTags(site)`: the terrain with a capital letter, then `Step-free access` when the beach is accessible,
then `Free parking` when the parking line has the word "free" in it (any case). Plain TypeScript, no React Native.
(b) The pills are bars as wide as the panel, one under the other: the column's stretch. Make them a row that wraps,
with the gap between them. Done when `npm test` says `Tests:       5 passed, 5 total`, and `npm run typecheck` and
`npm run lint` print nothing after their two `>` lines.

**Stretch:** in `src/SitePanel.tsx`, put a "Full" pill straight into the card, outside the tag row, and look at it in
`npm run web`. Then fix it two ways: `alignSelf: 'flex-start'` on the pill, or a row around it.
