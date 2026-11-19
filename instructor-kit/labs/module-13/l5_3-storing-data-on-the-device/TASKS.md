# Lab 5.3: what the phone keeps, and how

New practice on Lesson 5.3's ideas, on a crew leader's preferences and notes about each beach instead of the
course app's settings and logbook. No phone is needed: Jest runs AsyncStorage on the package's own test version,
and expo-sqlite on the SQLite engine built into Node 24 (`__mocks__/`: do not edit). The SQL and SQLite's error
messages are real; in the app, expo-sqlite shows the same SQLite message inside its own error text.

**Setup:** a terminal in `labs/module-13/l5_3-storing-data-on-the-device/starter` (the shared lab install: nothing
to install). Run `npm test` now: 6 of the 8 tests fail. Read the first failure of each task from the top.

## Task 1: read it back like API data (src/state/prefs.ts)

`loadPrefs()` trusts whatever was saved under `crew-lab-prefs`. An older version of the app saved
`{"unit":"stone"}`, and a bug once saved `{not json`. Check what you read: keep a unit only if it is `kg` or `lb`,
`tipsSeen` only if it is a boolean, and give the defaults (with a `console.warn`) when the text is not JSON at all.
`loadPrefs` never rejects. Done when the four Task 1 tests pass.

## Task 2: values go in ?, never into the SQL text (src/storage/notes.ts)

`addNote` builds its SQL from the note, so "Theo's bags are by the stairs" ends the SQL string early: read
SQLite's message in the failing test. Pass every value as a `?` with `runAsync`, and do the same in `notesFor`,
which should also list one site's notes newest first. Done when both Task 2 tests pass.

## Task 3: a table that changes later (src/storage/notes.ts)

Version 1 of the app made `site_notes` without the `tide` column; this version added it to the
`CREATE TABLE IF NOT EXISTS`. A new phone is fine. A phone that already has version 1 of `notes.db` is not: the
table exists, so it is skipped, and the first note with a tide fails. Give the database a version number
(`PRAGMA user_version`) and one step per version, in one transaction; notes from version 1 get the tide
`unknown`. Never change a step that has shipped: add one. Done when `npm test` says
`Tests:       8 passed, 8 total`, and `npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Stretch:** add `noteCounts()`: one row per site with its number of notes, the site with the most first
(`GROUP BY site_id`, `COUNT(*)`). Write a test for it in a file of your own.
