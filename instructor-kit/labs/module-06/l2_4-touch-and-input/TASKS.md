# Lab 2.4: the check-in desk

On the morning of a cleanup, the organizer stands at a folding table with a phone: a tap checks a volunteer in,
the bag count goes in at the end. This lab builds that desk (new material, not the lesson's project) and practices
Lesson 2.4 on it: a button a finger can use, a text field for a number, a switch, and taps that still work while
the keyboard is open. Every mistake in the starter is a web habit that works with a mouse.

Setup: nothing to install (the shared lab install, `npm install` once in `shoreline/labs`). Open a terminal in
`starter/` and run `npm test` once as shipped, then `npm run typecheck`: together they are your to-do list. Do the
tasks in order: the desk's tests press the Check in buttons, so they need Task 1's role first.
`fixtures/` holds real answers of the course API (the desk shows the first six volunteers and the next cleanup).
React Native Testing Library presses, holds and types like a finger: `user.press` is a tap (press in, press out,
press), `user.longPress` a hold (press in, long press, press out), `user.type` typing.

## Task 1: a button for a finger (src/CheckInButton.tsx)

It uses `onClick`, which type-checks and lints clean and never runs on a phone. Make a tap check the volunteer in
(`onPress`), and once they are in, make a long press undo it (`onLongPress`: a second, optional action; the visible
words do not change). Give it `accessibilityRole="button"`, an `accessibilityLabel` (`Check in Aisha Rahman`, and
once checked in `Aisha Rahman, checked in. Hold to undo`), a finger-sized target (`minHeight: 48`, never `height`)
and press feedback with a style function (`styles.pressed` while the finger is down, `styles.done` once checked in).
Done when the three Task 1 tests pass.

## Task 2: a number field (src/BagCountField.tsx, src/parseBags.ts)

`npm run typecheck` reports two errors on the `onChange` line: read both (an event's target is not an element with a
value). Use `onChangeText`, and ask for the number keyboard (`inputMode="numeric"`). Then write `parseBags`: the
field still gives a string. Done when both Task 2 tests pass.

## Task 3: the desk (src/CheckInDesk.tsx)

The switch gets `onChange`, the web way, and `npm run typecheck` says what is wrong with it: use `onValueChange`.
Then the keyboard: someone has just typed the bag count, the keyboard is open, and they tap a Check in button. With
the scroll view as it is, that first tap only closes the keyboard. Let taps reach the buttons
(`keyboardShouldPersistTaps="handled"`) and put the keyboard away when the list is scrolled
(`keyboardDismissMode="on-drag"`). Done when both Task 3 tests pass.

## Done when

`npm test` says `Tests:       7 passed, 7 total`, and `npm run typecheck` and `npm run lint` print nothing after
their two `>` lines. Only a phone shows the keyboard, the native switch and how 48 feels under a thumb: try them in
Expo Go in the lesson project's Step 6.
