# Lab 6.4: gear back on time

New practice on Lesson 6.4's ideas, on something the lesson did not build: the crew's gear shed lends litter
grabbers, sand sieves, gloves and buckets, and a volunteer who borrowed one gets a local reminder at 5 pm the day
before it is due back. A tap on the reminder opens the loan's screen (`/loans/<id>`). The app never schedules
"here" and cancels "there": one function, `syncGearReminders`, makes the phone's reminders match the loans, and it
is safe to run as often as you like (Lesson 6.4's `updateReminders`, on new data).

There is no phone here: the tests pass `syncGearReminders` a stand-in for the phone's scheduler that keeps the
requests in memory, with the three functions of expo-notifications it needs. On a phone you would pass
`expo-notifications` itself. What a phone then shows (the notification, the tap) is for your phone.

**Setup:** a terminal in `labs/module-16/l6_4-notifications/starter` (the shared lab install: nothing to install).
Run `npm test` and `npm run typecheck`. Read both from the top.

## Task 1: when to remind (src/gearReminders.ts)

`reminderTime` works out "the day before" by taking one from the day in the text. Find the loan in the tests for
which that fails, and use the lesson's way: build 5 pm on the due date by the phone's clock, then step back one
day with `setDate`. Then `loansToRemind`: a loan that is back at the shed needs no reminder. Done when both Task 1
tests pass.

## Task 2: one function that makes it so (src/gearReminders.ts)

`npm run typecheck` reports one error: read it from the top (the lesson's Common Mistakes have it too). Write the
trigger as an object with a `type`. Then the cancel loop: it clears every reminder that is not wanted, including
ones that are not the gear shed's at all (another feature's, the developer's test reminder). Cancel only the ids
that start with `idPrefix`. Done when the three Task 2 tests pass and `npm run typecheck` prints nothing after its
two `>` lines.

## Task 3: what a tap may open (src/taps.ts)

`isLoanPath` accepts anything that starts with `/loans/`. A notification's data is outside input: accept only
`/loans/` followed by letters, digits, `_` and `-` (a regular expression, as the lesson's `isCleanupPath`). Done
when `npm test` says `Tests:       12 passed, 12 total`, and `npm run typecheck` and `npm run lint` print nothing
after their two `>` lines.

**Stretch:** the volunteer returns the sieve at the shed and the organizer marks it returned on another phone.
When does this phone's reminder disappear, and what could make it disappear at once? (Hint: Lesson 6.4's list of
moments `updateReminders` runs, and "What Server Push Would Need".)
