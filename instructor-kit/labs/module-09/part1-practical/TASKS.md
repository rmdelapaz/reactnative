# Part 1 assessment, practical: the café's volunteer sign-up list (30 minutes, open book)

Open book: the lesson pages, your own code and the Part 1 project. No chat assistants, no classmates. Work in
`labs/module-09/part1-practical/starter`. `npm test` runs five tests (all fail as handed out);
`npm run typecheck` must print no error when you hand in. Points per task are in brackets (10 in all).

## Task 1: a label per shift (src/shifts.ts) [3]

`shiftLabel(shift)`: `Setup crew (9:00)`, `Repair tables (10:00 to 13:00)`, `Cleanup crew (13:00)`. One entry per
shift, so TypeScript would list a missing one if the café added a shift.

## Task 2: the list and its switch (src/SignUpList.tsx) [4]

A FlatList of the volunteers: each name as a heading (`accessibilityRole="header"`) with its shift's label under it,
keys from the id. Above the list: a switch labeled `Only repair tables`, and the count, `4 volunteers`, or
`2 of 4 volunteers` while the switch is on. The shown list and the count are worked out from state, never stored.

## Task 3: add a volunteer (src/SignUpList.tsx) [3]

A name field (`accessibilityLabel="Volunteer name"`) and a button `Add volunteer`: it adds a repair-table volunteer
with that name and clears the field. With no name, nothing is added and `Type a name first.` shows with
`accessibilityRole="alert"`. Done when `npm test` says `Tests:       5 passed, 5 total`.
