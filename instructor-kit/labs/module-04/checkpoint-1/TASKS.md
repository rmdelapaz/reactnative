# Checkpoint 1: Modules 1 and 2 so far (30 minutes, on your own)

One small piece of a phone app, built with what Lessons 1.1 to 2.2 taught: a beach card for the crew's six beaches.
`fixtures/sites.json` is a real answer of the course API (`GET /api/sites`); `src/types.ts` is the shape of one
beach. Open book: the lessons and your own code are allowed; your neighbor's screen is not. Your instructor scores
it with a five-row rubric (0, 1 or 2 points each).

**Setup:** a terminal in `labs/module-04/checkpoint-1/starter`, then `npm test`: every test fails (read the first
message from the top: you have seen it before).

## Part A: trust the JSON only after checking it (src/site.ts, Lesson 1.3)

Write the type guard `isSite(value: unknown): value is Site`: true only when every field of `Site` is there with the
right type, and `terrain` is one of the four words. No `any`, no `as`.

## Part B: a web card, rebuilt for a phone (src/BeachCard.tsx, Lessons 1.1 and 2.1)

Every piece of text in a `<Text>`; the beach's name is the card's heading (`accessibilityRole="header"`); the button
responds to a finger and, once saved, uses `styles.buttonSaved` on top of `styles.button` (a style array).

## Part C: lay it out (src/BeachCard.tsx, Lesson 2.2)

The name and the town in a header row: the town at the far end, both lined up through their middles, the name
allowed to shrink. "Parking" (the `label` style) and its value side by side, the value taking the rest of the row.
The access badge only as wide as its words.

**Done when** `npm test` says `Tests:       5 passed, 5 total`, and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines. Then answer in one sentence each, on the back of your workbook page: which of the
starter's mistakes would `npm run typecheck` have caught, and which would the web preview have hidden?
