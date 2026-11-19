# Lab 4.3: a session that tells everyone, a saved copy you can trust, and guarded screens

New practice on Lesson 4.3's ideas, outside the course app: the session lives in memory with listeners
(`src/session.ts`), components read it with `useSyncExternalStore` (`src/useSession.ts`), a copy is kept in the
phone's secure storage (`src/savedSession.ts`), and a layout decides which screens exist for whom with
`Stack.Protected` (`src/CrewStack.tsx`). `fixtures/` holds real answers of the course API (Theo's sign-in, the
organizer's `GET /api/auth/me`). No phone, no API: Jest stands in for the keychain, and expo-router's
`renderRouter` opens the stack at any address, exactly like a link or a typed address.

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`). Then a terminal in
`labs/module-11/l4_3-sign-in-flows-and-protected-routes/starter` and `npm test`: three test files, most tests fail.
Read the failures from the top, one task at a time.

## Task 1: a store that tells its listeners (src/session.ts)

`setSession` changes the session, and nothing on screen changes: the badge still says "Not signed in". Read
`useSession.ts`: when does `useSyncExternalStore` draw again? Fix `setSession`, nothing else. Done when both
Task 1 tests in `badge.test.tsx` pass. Then the question for your table: why does `useSession` pass a third
function, `() => null`? (Lesson 4.3's first Common Mistake.)

## Task 2: a saved copy you can trust (src/savedSession.ts)

`restoreSession()` runs once at startup. As shipped it trusts whatever it finds, and it fails in three ways the
tests show: the web preview's secure storage throws (`isAvailableAsync()` says false there, and the starter never
asks), damaged JSON makes it reject (the app would never start), data in an older shape becomes a "session"
without a user. And nothing is saved when the session changes. Ask first, check with `isSession`, catch everything,
then listen with `onSessionChange` and save (`setItemAsync` with JSON, `deleteItemAsync` for null). Done when the
four Task 2 tests pass. Never store a password: only the token and the user.

## Task 3: who may open which screen (src/CrewStack.tsx)

The kit room (who has the keys to the gear shed) is for organizers only, and today a volunteer who types
`/kit-room` sees it. Put it in a `Stack.Protected` group with the right `guard`. Predict before you run: where
does Expo Router send a volunteer who opens the address anyway? Done when `npm test` says
`Tests:       11 passed, 11 total` (the last Task 3 test needs Task 1 too: a guard can only react to a change it
hears about), and `npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Remember:** a guard decides what the app shows; the API's 401 and 403 answers are what protect the data.
