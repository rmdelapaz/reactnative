# Starting with Part 3: catch up from the course download

For anyone who joins the course at Part 3, or whose Shoreline Crew code is not at the end of Lesson 6.5. The course
download `lesson-25-start.zip` is exactly that code: shoreline-api and shoreline-crew after Lesson 6.5.

## Task 1: a fresh course folder from the download

1. Make a NEW, empty course folder (for example `shoreline-part3`), outside OneDrive, iCloud or Dropbox. Keep your old
   folder: rename it, do not mix the two.
2. Unzip `lesson-25-start.zip` into it, so that `shoreline-api/` and `shoreline-crew/` sit directly inside (move the
   inner folders up if your unzip tool added a level). Copy the kit's `labs/` folder next to them and run
   `npm install` once in `labs/` if you have not done it for Part 1 or 2.
3. As the download's `README.txt` says, in `shoreline-crew`: copy `.env.example` to `.env.local` (keep
   `http://localhost:4000` for the web preview; a phone needs your computer's address, Lesson 5.1), then `npm ci`
   (it installs the exact versions in `package-lock.json`).

`starter/` stands for the folder right after unzipping (packages not installed yet); `solution/` for the folder after
step 3. Your instructor's checker builds both from the same download.

## Task 2: prove it runs

1. Terminal 1, in `shoreline-api`: `node server.ts`. Leave it running.
2. Terminal 2, in the course folder: `node labs/module-18/l7_0-catch-up/check_environment.mjs`. The last line must
   say READY (Session 1's check, unchanged: Node, the API, the app bundles for the web preview, tsc, lint).
3. In `shoreline-crew`: `npx tsc --noEmit` and `npx expo lint` print nothing but lint's two `env:` lines. Run them
   AFTER the check (or after a first `npx expo start`): Expo writes the app's typed routes on its first start, and
   before that tsc reports `error TS2322` on every `[id]` screen's `id` (`string | string[] | undefined`).
4. `npx expo start`, press w, sign in as theo.nakamura@example.com (password shoreline-demo): the Logbook's
   "Bring in my sent logs" shows "1 log in all: 42 pieces, 1 bag, 2.5 kg". Lesson 7.1 turns that sentence into four
   counting tallies.

Done when the check ends with `READY for React Native & Expo: Build and Ship a Mobile App`.
If it says `shoreline-crew has no packages yet`, step 3's `npm ci` did not run (or ran in the wrong folder).
