# Part 1 project: Fix-It Tables for the Alder Row Repair Café

## The client

The Alder Row Repair Café is a fictional neighborhood repair café: once a month, volunteers ("fixers") sit at four tables in
the Alder Row community hall (electronics, clothing and bags, bikes, furniture), and neighbors bring things that are
broken. Each item gets a paper tag with a number. Rosa Delgado-Finch, the café's volunteer coordinator, runs the queue from a
clipboard today. She wants a phone app for the fixers: today's tickets, findable by item or by name, with the
finished ones out of the way, grouped by table when the hall is busy, readable in a dim hall at night (dark mode),
and one press to mark a repair done.

## What is given, and what you write

Everything runs from local data (`src/data/tickets.ts`, twelve tickets): no API, no network. The packages come from
the labs' one shared install (nothing to install). Work in `starter/` (or in a copy of it next to it, `mine/`).

| | Given | You write |
|---|---|---|
| Setup | Expo SDK 58 with Expo Router (`src/app/_layout.tsx`), the course's Jest setup, a strict `tsconfig.json`, ESLint | Nothing: `npm test`, `npm run typecheck`, `npm run lint`, `npm run web` |
| Theme and parts | `src/theme/` (colors by job, light and dark; spacing), `useTheme` + `createThemedStyles`, `useColumns`, `AppText`, `Button`, `Badge`, `SwitchRow`, `SearchField`, `EmptyState`, `useScreenScroll` | Nothing: reuse them, never copy them |
| Data and tests | `src/data/tickets.ts`, `src/project.test.tsx` (13 tests), `src/types.check.ts` (type tests) | Nothing: they are the café's acceptance criteria (do not edit them) |
| **TODO A** | | `src/types.ts`: the types: `Category` and `TicketStatus` as unions of words, `Ticket` exactly as the data (the tag `number`, the optional `fixer`) (Lessons 2.5, 3.1 (and the TypeScript of the prerequisite course)) |
| **TODO B** | | `src/utils/tickets.ts`: the words and the rules: three `Record` tables, `isFinished`, `matchesSearch`, `filterTickets`, `countLabel`, `groupByCategory` (Lessons 2.5, 3.1) |
| **TODO C** | | `src/components/TicketCard.tsx`: the ticket card: a heading and its tag, a status `Badge`, the optional fixer line, a Show problem toggle with `accessibilityState`, Mark fixed while in repair (Lessons 2.1 to 2.4) |
| **TODO D** | | `src/app/index.tsx`: the queue screen: a `FlatList` that is the whole screen, a header element (search, two switches, the count), two columns at 700 wide, the empty state, Mark fixed in state, and the grouped `SectionList` (Lessons 2.4, 2.5, 3.1) |

## Run it

```bash
cd labs/projects/part1-alder-row-repair-cafe/starter
npm test              # the acceptance tests (once, then it exits)
npm run typecheck     # tsc --noEmit: the types, and the type tests in src/types.check.ts
npm run lint          # npx expo lint
npm run web           # the web preview (w); Ctrl+C stops it. A phone with Expo Go: npx expo start
```

As handed out, `npm test` fails every test and `npm run typecheck` reports the TODO A errors. Work through the
TODOs in order; each one makes more tests pass.

## Done when

- `npm test` passes every test, `npm run typecheck` and `npm run lint` print nothing after their two `>` lines
  (Expo's two `env:` lines do not appear here: the project has no `.env.local`), and
  `npx expo export --platform web --output-dir dist` ends with `Exported: dist`.
- In the web preview at 390 wide and at 1024 wide, in light and in dark mode: the search keeps every letter, both
  switches work, Mark fixed changes the card and the count, the tables stay pinned in the grouped view.
- A 3-minute demo is ready: one ticket from `src/data/tickets.ts` to its card, and one Mark fixed press to the new
  count.

## Milestones

- **Session 8 (kickoff, in the room):** the folder copied and `npm test` run; TODO A done (`npm run typecheck` clean of TS2578); TODO B started
- **Before Session 9 (at home, 2 to 3 hours):** TODO B and C done; TODO D's FlatList with the header element and the count
- **Session 9 (check-in and demo):** TODO D close: empty state, Mark fixed, two columns; the grouped view may still be open
- **One week after Session 9 (hand-in):** every test, `npm run typecheck`, `npm run lint` and the web export pass; the journal entry from TASKS.md

## Rubric (12 points, complete = no row at 0)

| Criterion | Not yet (0) | Meets (1) | Strong (2) |
|---|---|---|---|
| 1. Types and data | `string` where the data has a fixed set of words, `any`, or `as` to silence an error (`npm run typecheck` fails) | Unions for `Category` and `TicketStatus`; `Ticket` describes the data exactly (the optional `fixer` included); `Record` tables for every label and tone; `npm run typecheck` prints no error (the type tests in `src/types.check.ts` pass) | Comments on the types say what each word means for the café; can show that adding a status to the union makes tsc list every table that needs it |
| 2. Components and layout | One large component, a `div`-style layout copied from the web, or loose text outside `<Text>` | `TicketCard` and the screen are separate components with typed props; the given `AppText`, `Badge`, `Button`, `SwitchRow` and `SearchField` are reused, not copied; the card's top row is a flexbox row that wraps a long item name | Nothing passed down that a component does not use; styles in `StyleSheet.create` with the spacing tokens, no magic numbers |
| 3. Touch and input | Controls without labels, `onClick`, or a toggle that does not say whether it is open | The search field keeps every letter (a header ELEMENT); the two switches have labels; Show problem has `accessibilityState={{ expanded }}` and a label that starts with its visible words and names the item ("Show problem: Toaster"); Mark fixed only while in repair, and it changes the ticket in state (a new array, a new ticket) | Touch targets of 48 or more (`hitSlop` where a target is small); can explain why `markFixed` copies instead of editing |
| 4. The themed list | A `ScrollView` with `map`, index keys, the list inside another scroll view, or colors that ignore dark mode | A `FlatList` that is the whole screen (`useScreenScroll`), keys from `ticket.id`, two columns at 700 wide without an error (`key={columns}`), the empty state with Show all repairs, the grouped `SectionList` with sticky table headings that have a background; every color from the theme | Checked at 390 and at 1024 wide, light and dark (written down); the shown list and the count derived on every render, never stored |
| 5. Accessibility and the phone | Headings, buttons or switches that a screen reader cannot name | The item names and the table names are headers; every button and switch has a name that makes sense on its own; the safe areas are respected (`useScreenScroll`); `npx expo lint` reports 0 problems | A screen-reader or keyboard pass in the web preview written down (what is announced for one card), and a look on a phone in Expo Go if there is one |
| 6. Checks and explanation | Tests, the type check, the linter or the web export fail, or cannot say what a line of their own code does | `npm test`, `npm run typecheck`, `npm run lint` and `npx expo export --platform web` all pass; a 3-minute demo: one ticket from the data file to its card, and one Mark fixed press to the new count | Names one decision and its alternative (an element or a component for the header; `FlatList` or `SectionList`; state in the card or in the screen) and when each wins |

## Stretch (not scored)

- A third switch: "Only my table" with a fixer's name picked from the tickets.
- A summary line per table in the grouped view ("Bikes: 1 of 2 fixed").
- The grouped view in two columns on wide screens (Lesson 3.2's flattened rows on FlashList, headings spanning both columns).

## Journal (hand in with the project)

Which Part 1 idea did this project use most, and where in your code? Which decision would you make differently
for a café with 300 tickets a day, and why?
