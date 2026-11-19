# Lab 5.4: a form for one thumb

New practice on Lesson 5.4's ideas, on a crew leader's shift report (who led, how many volunteers came, how many
hours) instead of the course app's sign-in and debris log. React Hook Form and Zod come across from the web course
unchanged; the seam between them and React Native is the lab. Each task has its own tool that finds the problem:
the tests, the linter, the type checker.

**Setup:** a terminal in `labs/module-13/l5_4-mobile-forms/starter` (the shared lab install: nothing to install).
Run all three now: `npm test` (6 of 7 tests fail), `npm run lint` (errors in `ControlledInput.tsx`) and
`npm run typecheck` (an error in `ShiftReportForm.tsx`). Read the first message of each from the top.

## Task 1: React Hook Form without an input (src/ControlledInput.tsx, src/ShiftReportForm.tsx)

The form uses `{...register('leader')}` on React Native's TextInput: it type-checks, lints clean and sends
nothing. `ControlledInput` (useController) is the phone's way in, but the linter rejects it: read the rule it
quotes. Take `field` and `fieldState` apart where you get them, then use `ControlledInput` for the three fields
(labels `Crew leader`, `Volunteers`, `Hours`). Done when both Task 1 tests pass and `npm run lint` is quiet.

## Task 2: the keyboard's decimal key (src/schema.ts)

On a phone set to German, French or Spanish, the decimal pad types `2,5`. The schema rejects it, and the
volunteer cannot fix that from the keyboard. Accept a comma as the decimal point. Done when both Task 2 tests pass.

## Task 3: Next, Next, Go (src/ShiftReportForm.tsx)

On a phone there is no Tab key: the key in the keyboard's corner walks the form. Give Crew leader and Volunteers a
Next key that moves the focus on (`enterKeyHint`, `submitBehavior="submit"`, `onSubmitEditing` with `setFocus`),
and Hours a Go key that sends the report. Then fix what `npm run typecheck` says about the button: make the
submit function once with `handleSubmit` and call it with no arguments from both places. Done when `npm test`
says `Tests:       7 passed, 7 total`, and `npm run typecheck` and `npm run lint` print nothing after their two
`>` lines.

Lesson 5.4's hedge applies here too: according to React Native's documentation, the iPhone's number and decimal
pads have no return key at all, which is why the visible Send report button stays. The tests check what the code
asks for; only a phone shows the keyboards.

**Stretch:** add an optional `note` field (multiline, at most 300 characters) after Hours, so Hours's key says Next
and moves to the note, and only the button sends. Which test would you change, and why?
