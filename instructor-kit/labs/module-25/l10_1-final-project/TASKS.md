# Lab 10.1: types first on a new brief, inside the starter

New practice on Lesson 10.1's Milestone 1, on a brief that is NOT one of the seven: **Saltwick Kayak Hire**, a
harbor shop that rents single and tandem kayaks by the hour. Staff book a kayak for a customer, mark it out on the
water and returned, or cancel a booking. Two rules matter: a kayak is never booked twice for the same time (only the
server sees every booking), and a finished rental never changes.

**Setup (once, about two minutes):** make a PRACTICE copy of the final-project kit's starter, next to (never inside)
your `shoreline` folder, and install it. On macOS, Linux or Git Bash:

```
cp -R final-project-kit/starter ~/projects/saltwick-practice
cd ~/projects/saltwick-practice
npm ci
npx expo customize tsconfig.json
```

(PowerShell: `Copy-Item -Recurse final-project-kit\starter $HOME\projects\saltwick-practice`, then the same three
commands.) `npx expo customize tsconfig.json` writes the generated types without starting Metro, as the starter's CI
does. Then copy this lab's `starter/src/` folder over the practice copy's `src/` (it only ADDS `src/rentals/`):
`cp -R labs/module-25/l10_1-final-project/starter/src/. ~/projects/saltwick-practice/src/`. Every command below
runs in `saltwick-practice`. Delete the practice copy when you are done: your final project starts from its own copy.

## Task 1: the status the tables have not learned (src/rentals/labels.ts)

`src/rentals/types.ts` is the brief's types: a `RentalStatus` union, `Rental`, and `NewRental` and `RentalChanges`
made from `Rental` with `Pick`. Last week the shop added `'cancelled'` to the union. Run `npx tsc --noEmit`: it
lists every table that has not learned the new status. Decide its words and its moves (which status can lead to
it? is it finished?), then write `isLate()`: computed from the status and the return time, never stored. Done when
the type check prints nothing and the three Task 1 tests pass in `npm test -- --watchAll=false src/rentals`.

## Task 2: the rule only the server can check (src/rentals/rentals.ts, src/mock-api/handle.ts)

Register the resource with one line (and its import) in the starter's `src/mock-api/handle.ts`, as Lesson 10.1's
Step 6 does for Copperline's deliveries. Then write `clash()`: a kayak that is booked or out cannot be booked again
for any minute of the same time; returned and cancelled rentals free it. The handler already answers the 409 with
the message under the `start` field when `clash()` finds a booking. Done when the four Task 2 tests pass.

## Task 3: one step at a time, and the rule that must not break (src/rentals/rentals.ts)

Write `change()` for `PATCH /rentals/:id`: a 400 when the body has no known status, a 409 for any move the
`nextSteps` table does not allow ("A Booked rental can only move to Out on the water or Cancelled.") and for a
finished rental ("A Returned rental is finished: it cannot change."), else the change. The same table will decide
which buttons a rental's screen offers. Done when `npm test -- --watchAll=false src/rentals` says
`Tests:       9 passed, 9 total`, and `npx tsc --noEmit` and `npx expo lint` print nothing.

**Stretch:** the shop wants "lost at sea" for a kayak that never came back. Add it to the union and let
`npx tsc --noEmit` lead you. Which moves lead to it, and does a lost kayak still block new bookings? Write the test
first.
