# Lab 6.5: the gear shed's inventory

New practice on Lesson 6.5's ideas, on something the lesson did not build: the crew's gear sheds keep an
inventory (litter grabbers, sieves, buckets, gloves), the coordinator wants it as a spreadsheet file, and a
checkout at the shed deserves a short buzz when it goes through. Three small files, each with one of the lesson's
traps in it.

There is no phone here: the tests stand in for expo-haptics, expo-file-system and expo-sharing and record what
your code ASKED for (which buzz, which file, which share). Whether the buzz feels right and which apps the share
sheet offers is for your phone, as the lesson says.

**Setup:** a terminal in `labs/module-16/l6_5-haptics-sharing-and-files/starter` (the shared lab install: nothing to
install). Run `npm test`: every test fails. `npm run typecheck` and `npm run lint` say almost nothing: none of these
bugs is a type error.

## Task 1: a file a spreadsheet trusts (src/inventoryCsv.ts)

Quote every text cell and double each quote inside it, so a comma, a quote or a line break in a note stays in its
cell; put a `'` before text that starts like a formula (`=`, `+`, `-`, `@`, a tab, a carriage return); write a
missing date (`null`) as an empty cell; start the text with a byte order mark (`\uFEFF`) and end every row with
`\r\n`. Numbers stay bare. Done when the four Task 1 tests pass.

## Task 2: a buzz that knows its place (src/buzz.ts)

The starter thumps the same way for everything, on every platform, even with the volunteer's switch off. Nothing
when `hapticsOn` is false; on Android `performAndroidHapticsAsync` with `AndroidHaptics.Confirm` or `Reject`;
everywhere else `notificationAsync` with `NotificationFeedbackType.Success` or `Error`; and a buzz that cannot play
is never an error (`.catch(() => {})` on the Promise, as the lesson's `feel()` does). Done when the four Task 2
tests pass.

## Task 3: share it, and survive the web preview (src/shareInventory.ts)

Three problems: the exports folder is made at the top of the module (in the web preview, reading `Paths.cache`
throws the moment the file is imported); "is there a share sheet?" is checked, but not "is this the web?" (a
browser can have a share sheet and still no files); and the file is shared with no type and next to every
previous export. Make the folder inside the function, check the platform first, delete the previous exports, and
share with `mimeType: 'text/csv'` and `UTI: 'public.comma-separated-values-text'`. Done when `npm test` says
`Tests:       12 passed, 12 total`, and `npm run typecheck` and `npm run lint` print nothing after their two `>`
lines.

**Stretch:** `shareInventory` resolves with `'done'` when the sheet closes. Why does it not say "shared", and why
does it not delete the file right after `shareAsync` resolves?
