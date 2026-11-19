# Starting with Part 2: the course code at the start of Lesson 4.1

For learners who join at Part 2 (Sessions 10 to 17), or whose own Shoreline Crew from Part 1 is broken. You
start from the course's own code at the end of Lesson 3.2, which is exactly the start of Lesson 4.1: the API
(`shoreline-api`) and the app (`shoreline-crew`) with everything Part 1 built (the themed list of upcoming
cleanups with search, paging and pull to refresh, the card's quick look, fonts, icons and dark mode).

You need Node.js 24 LTS, VS Code and (optional) Expo Go on your phone, as in the setup guide.

## Task 1: Unzip and install (10 minutes)

1. From the course site's Downloads, get `lesson-11-start.zip` (the code at the START of Lesson 4.1).
2. Make a fresh course folder `shoreline` and unzip into it, so that `shoreline/shoreline-api/server.ts` and
   `shoreline/shoreline-crew/package.json` exist (if your unzip tool added a folder level, move the inner folders
   up). Copy the kit's `labs/` folder into `shoreline` too, next to them.
3. In `shoreline/shoreline-crew`, copy `.env.example` to `.env.local` (keep `http://localhost:4000` for the web
   preview: Lesson 5.1 covers phones). The download's README.txt says the same.
4. Still in `shoreline-crew`: `npm ci` (it installs the exact versions in `package-lock.json`, a few minutes the
   first time).

## Task 2: Run it and check it (10 minutes)

1. Terminal 1, in `shoreline/shoreline-api`: `node server.ts` (leave it running).
2. Terminal 2, in `shoreline`: `node labs/module-10/l4_0-starting-with-part-2/check_environment.mjs`.
   Done when the last line says `READY for React Native & Expo: Build and Ship a Mobile App`.
   (`shoreline-crew has no packages yet` means step 4 of Task 1 did not run.)
3. In `shoreline-crew`: `npx tsc --noEmit` prints nothing, and `npx expo lint` prints only its two `env:` lines.
4. `npx expo start`, then `w`: the Cleanups list in the web preview. Ctrl+C stops it.

Then read the Session 10 workbook's "Part 1 in one page" before Lesson 4.1: it is what this code already does.
