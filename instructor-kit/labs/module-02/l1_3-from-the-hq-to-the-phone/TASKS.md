# Lab 1.3: from the HQ to the phone
New practice on Lesson 1.3's ideas (not the lesson's own project): code copied from Shoreline Crew HQ, sorted into
"copy as it is" and "rewrite for the phone". The lab's `src/` has the same folders as the course app: `api/`
(`types.ts` = excerpts of the API's contract, never edited; `client.ts` adapted from the HQ), `utils/format.ts`
(the HQ's `formatDate`, copied), `shared/eventText.ts` (three more HQ helpers) and `components/NextUp.tsx` (a small
"next cleanup" box that uses them). `fixtures/` holds real answers of the course API. MSW answers the requests in
the tests, so you need no API and no phone.

**Setup:** the shared lab install (`npm install` once in `shoreline/labs`). A terminal in
`labs/module-02/l1_3-from-the-hq-to-the-phone/starter`, then `npm test`: three tests fail. Run `npm run typecheck` too: it prints nothing
after its two `>` lines. Remember that.

## Task 1: what tsc cannot see (src/shared/eventText.ts)
Two of the three helpers fail their test with a TypeError or a ReferenceError: the same thing happens on a phone,
while the type checker accepts every line (Expo's settings include the browser's types for the web preview). Make
the search habit from the lesson your first move:

    grep -n -E 'window|document|Storage|import\.meta' src/shared/*.ts src/api/*.ts src/utils/*.ts

Rewrite the two helpers for a phone: the share message says `Find it in the Shoreline Crew app.` instead of a web
address, and the greeting takes the name it is given (no browser storage; the app keeps its session elsewhere, in
Lesson 4.3). Leave `spotsText` exactly as it was copied. Done when the three Task 1 tests pass and the search
finds nothing in `src/shared/`.

## Task 2: the error a phone throws (src/api/client.ts)
`NextUp` shows the next cleanup, or `describeError`'s words. Read the three Task 2 tests: the copied code shows the cleanup and the API's
error status, and fails the phone's "no answer" test. In a browser a fetch that gets no answer rejects with a
`TypeError`, which is what the HQ's `describeError` checks; on a phone, Expo's own fetch rejects with a `FetchError`
whose message starts with `fetch failed:` (the test throws one). Do what the course
app does: a `NetworkError` class, thrown by `request()` when `fetch` itself fails (a `try`/`catch` around the
`fetch` call only), and the matching branch in `describeError` instead of `instanceof TypeError`. Done when the three
Task 2 tests pass.

## Task 3: green tests, red linter (src/api/client.ts)
Both Task 3 tests pass already. Now run `npm run lint`: one error. Read the rule's name. Metro copies an
`EXPO_PUBLIC_` value into the bundle only where it finds the full text `process.env.EXPO_PUBLIC_API_URL`; with
destructuring, the address is simply not in the app. Write the name out in full, with a dot. Done when
`npm test` says `Tests:       8 passed, 8 total`, and `npm run typecheck` and `npm run lint` print nothing after
their two `>` lines.

**Optional:** with the API running, `EXPO_PUBLIC_API_URL=http://localhost:4000 npm run web` shows `NextUp` in the
web preview (PowerShell: `$env:EXPO_PUBLIC_API_URL="http://localhost:4000"; npm run web`). Stop it with Ctrl+C.
