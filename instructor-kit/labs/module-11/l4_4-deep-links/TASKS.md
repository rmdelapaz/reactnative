# Lab 4.4: links from outside, a link to share, and what a link may do

New practice on Lesson 4.4's ideas, outside the course app: every incoming link is input from outside
(`src/oldLinks.ts`, the function a `+native-intent.tsx` file exports), a shared link goes inside the message with a
fallback where there is no share sheet (`src/ShareButton.tsx`), the anchor puts the tabs underneath a linked screen
(`src/RootStack.tsx`), and a link only ever opens a screen (`src/CleanupScreen.tsx`). `fixtures/event-e08.json` is a
real answer of `GET /api/events/e08`. No phone, no API: the tests stand in for the share sheet, MSW answers the
screen's requests, and expo-router's `renderRouter` opens the app at an address exactly as a tapped link does.

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`). Then a terminal in
`labs/module-11/l4_4-deep-links/starter` and `npm test`: three test files, most tests fail.

## Task 1: old flyers, safely (src/oldLinks.ts)

Last year's flyers (`shorelinecrew://event/e08`) already work. Last spring's QR codes said
`shorelinecrew://flyer?cleanup=e17`: open `/cleanups/e17` for them too. And remember who writes links: anyone. An id
that is not letters and digits opens `/`, and the function must never throw (one test sends a broken `%`-escape;
read what `decodeURIComponent` does with it). Done when the four Task 1 tests pass.

## Task 2: share the link where every phone keeps it (src/ShareButton.tsx)

The button shares `{ title, message, url }`. On an iPhone the friend gets the message and the link; on Android,
React Native passes only the title and the message to the share sheet. Put the link inside the message with
`inviteMessage` (in `links.ts`). Then the second case: in a desktop browser there is no share sheet and
`Share.share()` rejects; show `Sharing is not available here. Copy this link instead: <the link>` in a `selectable`
`<Text>`. Done when both Task 2 tests pass.

## Task 3: what is underneath a link, and what a link may do (src/RootStack.tsx, src/CleanupScreen.tsx)

Every test in `linked.test.tsx` fails with the same message before it gets anywhere. Read its list of routes, then
fix the anchor (3a): the anchor names a screen of the layout it is written in. Then the second test fails for a
different reason: a link with `?join=yes` signed the volunteer up the moment the screen opened (3b). Anyone can
write such a link and send it to anyone. Make signing up wait for the volunteer's press. Done when `npm test` says
`Tests:       8 passed, 8 total`, and `npm run typecheck` and `npm run lint` print nothing after their two `>`
lines.

**Optional:** `npm run web`, press Share this cleanup in a desktop browser: the fallback, with the web preview's own
form of the link (`http://localhost:8081/...`: createURL picks it). Stop it with Ctrl+C.
