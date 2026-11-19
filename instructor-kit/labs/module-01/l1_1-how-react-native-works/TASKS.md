# Lab 1.1: React Native's building blocks, tested without a phone

New practice on Lesson 1.1's ideas (not the lesson's own CleanupCard): `<View>` is the box, every piece of text sits
in a `<Text>`, `<Pressable>` with `onPress` makes something tappable, and plain TypeScript carries over from the
web unchanged. Jest renders your components the way React Native does (no browser, no DOM, no phone), and the tests
in `src/lab.test.tsx` find things the way a screen reader does: by role (`header`, `button`) and by their words.
`fixtures/` holds real answers of the course API (`GET /api/sites`, `GET /api/events?when=upcoming`).

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`, if you have not done it yet). Then a
terminal in `labs/module-01/l1_1-how-react-native-works/starter` and `npm test`: four tests fail.

## Task 1: a web card, rebuilt (src/SiteCard.tsx)

Read the first failure from the top: `Text strings must be rendered within a <Text> component.` On a phone this is
the red error screen. Put the site's name in a `<Text>` with `accessibilityRole="header"` (the native `<h3>`) and the
`styles.name` style. Done when both Task 1 tests pass. Then run `npm run typecheck`: did tsc ever complain about the
loose text? What does that tell you about which tool finds which mistake?

## Task 2: onPress, not onClick (src/SignUpButton.tsx)

The button's test presses it like a finger and nothing happens. Find the web habit, fix it, then give the button
its pressed look: `style` can be a function of `{ pressed }` that returns `[styles.button, pressed && styles.pressed]`
(Lesson 1.1's CleanupCard does exactly this). Done when the Task 2 test passes.

## Task 3: code that carries over (src/spots.ts)

Write `spotsLabel(event)`: `Full: join the waiting list` with no spots left, `1 spot left` for one, otherwise
`5 spots left`. No React Native in it at all. Done when `npm test` says `Tests:       4 passed, 4 total`,
`npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Optional:** `npm run web` shows your cards in the web preview (react-native-web turns the View into a `<div>`,
the Pressable into a `<button>`). Stop it with Ctrl+C.
