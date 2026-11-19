# Part 2 project: Bookmobile Stops for the Tamarack County Library Bookmobile

Read BRIEF.md first (the client, the requirements R1 to R6, the rules). This sheet is the how.

## Get it running (two terminals)

The packages come from the labs' one shared install (`npm install` once in `shoreline/labs`): nothing to install
here. Work in `starter/` (or a copy of it next to it, `mine/`; keep the copy three folders under `labs/`).

```bash
# Terminal 1: the library's API (leave it running)
cd labs/projects/part2-tamarack-bookmobile/bookmobile-api
node server.ts                      # Bookmobile API running at http://localhost:4100/api

# Terminal 2: the app
cd labs/projects/part2-tamarack-bookmobile/starter
cp .env.example .env.local          # Windows PowerShell: Copy-Item .env.example .env.local
npm test                            # the acceptance tests (once, then it exits)
npm run typecheck                   # tsc --noEmit
npm run lint                        # npx expo lint
npm run web                         # the web preview (w); Ctrl+C stops it. A phone with Expo Go: npx expo start
```

On a phone with Expo Go, `localhost` is the phone: put your computer's address in `.env.local` and start the API with
`node server.ts --host` (Lesson 5.1), then `npx expo start --clear`.

As handed out, `npm test` fails all 25 tests (each test's name starts with its TODO: `R3a: the guards...`;
even the given Books tab waits for your R3a guards), and `npm run typecheck` and `npm run lint` are clean. The
starter's screens say "TODO Rn" where your work goes, so the web preview runs from the first minute. Library cards for signing in: **2145 0021** / PIN **4821**
(June Okafor) and **2145 0038** / PIN **1357** (Tomas Lindgren).

## The TODOs (suggested order: top to bottom)

| TODO | File | What | Lessons |
|---|---|---|---|
| **R1a** | `src/app/(tabs)/_layout.tsx` | the four tabs (titles, icons, the Holds tab's waiting count) | 4.2 |
| **R1b** | `src/app/stops/[id].tsx` | one stop from the address: its name, day and time, where; an unknown id; Make this my stop | 4.1, 5.2 |
| **R2a** | `src/auth/session.ts` | `loadSession()`: the saved session from SecureStore, checked; every change saved | 4.3 |
| **R2b** | `src/app/(tabs)/holds.tsx` | the Holds tab's two faces: guest, and the holds on this phone + on the server | 4.3, 5.2, 5.5 |
| **R3a** | `src/api/guards.ts` | `isStop`, `isBook`, `isHold`: true only for a whole, valid value | 5.1 |
| **R3b** | `src/app/(tabs)/index.tsx` | the Stops tab: loading, error, empty, the list, pull to refresh | 5.2 |
| **R4a** | `src/state/holdQueue.ts` | the persisted queue: `persist` + AsyncStorage, one clientId = one hold, saved holds checked | 5.5 |
| **R4b** | `src/state/sendHolds.ts` | `sendWaitingHolds()`: sent / refused / still waiting, from each answer | 5.5 |
| **R4c** | `src/state/myStop.ts` | My stop: saved with AsyncStorage, read back and checked | 5.3 |
| **R5a** | `src/api/schemas.ts` | `holdSchema`: a stop chosen, a note of up to 120 characters | 5.4 |
| **R5b** | `src/app/hold/[bookId].tsx` | the place-hold form: React Hook Form, a clientId per hold, into the queue | 5.4, 5.5 |
| **R5c** | `src/utils/nearest.ts` | `nearestStop()`: the closest stop and how far it is | 6.3 |
| **R5d** | `src/components/NearestStop.tsx` | Find my nearest stop: explain, ask, answer; a no is an answer | 6.1, 6.3 |

Each TODO's comment says what it must do, and which given file is the model (the Books tab is the model for the
Stops tab; Shoreline Crew's own code from Lessons 4.1 to 6.5 is the model for the rest).

## Done when

- `npm test` passes all 25 tests; `npm run typecheck` and `npm run lint` print nothing after their `>`
  lines; `npx expo export --platform web --output-dir dist`, `--platform android --output-dir dist-android` and
  `--platform ios --output-dir dist-ios` each end with `Exported:`.
- In the web preview, with the API running: the Stops tab lists 8 stops; `/stops/s02` opens Ridgeline Senior
  Center with a back arrow to the list; `/stops/s99` says the stop does not exist; signing in as June shows her
  ready hold; a hold placed with DevTools > Network > Offline waits ("Not sent yet") and is sent when you go back
  online; My stop survives a reload; "Find my nearest stop" asks only after Continue, answers after Allow, and
  shows the blocked face after Block.
- NOTES.md is written, and a 3-minute demo is ready: one hold from the form, through the queue, to the API.

## Milestones

- **Session 16 (kickoff, 20 minutes):** Read the brief, start the API and the starter, see the tests fail with their TODO names. Plan the order (R3a and R1a first: everything else stands on them).
- **Before Session 17:** R1 to R4 passing their tests (R3a, R1a, R1b, R3b, R2a, R2b, R4a, R4b, R4c); the app runs in the web preview with the API.
- **Session 17 (check-in, 15 minutes):** Show the Stops tab, a stop by its address, a sign-in and a hold placed. Name one thing you are stuck on.
- **One week after Session 17 (hand-in):** Everything in Done when, NOTES.md, and a 3-minute demo.

## Rubric (12 points, Part 2 project complete = no row at 0)

| Criterion | Not yet (0) | Meets (1) | Strong (2) |
|---|---|---|---|
| R1 Routing and tabs | Tabs or the stop screen missing, or an unknown stop id crashes the screen | Four tabs; `/stops/[id]` reads its id and says when a stop does not exist; a not-found screen | Plus: the anchor gives a linked stop a back button to the list; titles set from the data; a deep link tested in the web preview |
| R2 Simple sign-in and a protected tab | No sign-in, or the Holds tab shows (or requests) holds for a guest | Card number + PIN sign-in; session in SecureStore (memory on the web); sign-in modal guarded; Holds has a guest face | Plus: a saved session is checked before use; a 401 after an API restart signs the patron out cleanly; the PIN is cleared after a failed try |
| R3 Data from the mock API | fetch outside the client, or answers used without a guard, or a data screen with no error face | Typed client + guards; Query for every read; loading / error with Try again / empty / list on Stops; pull to refresh | Plus: query keys carry the viewer where the answer depends on it; refresh on focus; the API's own words shown for a 4xx |
| R4 Offline-safe storage | Holds are lost when the app closes offline, or a resend makes a second hold | Persisted queue with a clientId per hold; sent when online; refused holds kept with the server's words; My stop saved and read back | Plus: saved data checked when read back (a bad saved value cannot crash the app); only the owner's sign-in sends a hold; a waiting count on the Holds tab |
| R5 The form and the device feature | No form validation, or the location question pops up at startup, or a no breaks the screen | React Hook Form + Zod with messages under the fields; nearest stop asked after a press and an explanation; a no handled | Plus: My stop picked in the form already; the blocked face points to Settings (and the browser's site settings); "Make this my stop" from the answer |
| R6 Quality | Does not type-check, or lint errors, or failing tests, or no NOTES.md | tsc clean, lint 0 problems, every test passing, `npx expo export` web/android/ios, NOTES.md | Plus: accessibility labels and roles a screen reader can use everywhere; a test of your own; dark mode checked |

## Stretch (not scored)

- A map of the stops (react-native-maps on a phone, with a `.web.tsx` stand-in, as Lesson 6.3 does).
- A Books filter for "On the van this week" (`onVan`), and the audience (`?audience=children`).
- Exponential backoff for the queue (Lesson 5.5's Exercise 3).

## Journal (hand in with the project)

Which Part 2 idea did this project use most, and where in your code? What would change if the library had 40
stops and patrons placed holds from a farm with no signal for days?
