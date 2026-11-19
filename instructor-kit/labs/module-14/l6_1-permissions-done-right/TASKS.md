# Lab 6.1: voice notes, asked politely

New practice on Lesson 6.1's permission step, on a permission the lesson did not use: the microphone, for a
voice note on a debris log. `src/microphone.ts` stands in for a real module's permission functions (a real app
would use expo-audio's): the tests play the phone, decide what it answers and count how often its own question
appears. Its Hook is built with `createPermissionHook` from `expo`, exactly the way Expo's modules build theirs,
so it returns the same `[answer, ask, read again]` tuple as `Location.useForegroundPermissions()`.

**Setup:** a terminal in `labs/module-14/l6_1-permissions-done-right/starter` (the shared lab install). Run
`npm test` and `npm run typecheck` first.

## Task 1: every answer is a step (src/usePermission.ts, permissionStep)

Every no is `'denied'` in the starter, so the gate would keep offering "Ask me again" after the phone has stopped
asking. Use the lesson's table: `canAskAgain: false` means only Settings can help (`'blocked'`), and on the web
(`os === 'web'`) `canAskAgain` is always true while a browser never asks again after a block. Done when the six
Task 1 tests pass.

## Task 2: explain, then ask (src/AskFirst.tsx)

Three mistakes: the gate asks the moment it appears ("get it out of the way"), its button says Allow (the real
Allow is the phone's: yours says Continue), and Open Settings does nothing where there is no Settings app (the web
preview: `openSettings` throws there; show the browser note and Check again). Done when the four Task 2 tests pass.
Watch the linter too: what did it say about the starter's `useEffect`?

## Task 3: the panel (src/VoiceNotePanel.tsx and usePermission)

`npm run typecheck` reports one error in `VoiceNotePanel.tsx`: read it from the bottom. Fix it; then make
`usePermission` read the answer again when the app comes back to the foreground (TanStack Query's `focusManager`,
as in the lesson), so a volunteer who allowed the microphone in Settings sees the recorder at once. Done when
`npm test` says `Tests:       12 passed, 12 total`, and `npm run typecheck` and `npm run lint` print nothing after
their two `>` lines.

**Stretch:** what would `useMicrophonePermissions({ request: true })` change, and why does the lesson never use it?
