# Session 1 orientation: is your computer ready?

## The environment check (do this first, before Session 1 if you can)

1. Start the API in its own terminal: `cd shoreline-api`, then `node server.ts` (leave it running).
2. Open a second terminal in your course folder `shoreline` (the folder that holds `shoreline-api` and
   `shoreline-crew`; in VS Code: View > Terminal opens there). Stop `npx expo start` first if it is running.
3. Run:

   ```
   node labs/module-01/l1_0-orientation/check_environment.mjs
   ```

   (If your API runs on another address, add it: `... check_environment.mjs http://localhost:4100`.)

Done when the last line says `READY for React Native & Expo: Build and Ship a Mobile App` (`READY WITH NOTES` is
fine too: read the CHECK lines). `NOT READY`? Each FIX line says what to do; fix them in order and run the check
again. It changes nothing in your code: it reads your folder, asks the API three questions, starts the development
server for a moment on a spare port (like your first `npx expo start`, it writes Expo's generated type files) and
asks it to bundle the app for the web preview, then runs `tsc --noEmit` and `npx expo lint` in `shoreline-crew`.
It needs no phone: whether Expo Go on your phone reaches your computer is the network test in Lesson 1.2, Step 4.

## The diagnostic practice (at home, if the workbook's diagnostic showed a gap)

`diagnostic_starter.mjs` answers D1, D2 and D3 of the workbook's diagnostic in JavaScript, with one small mistake
each. Run it from the course folder (`node labs/module-01/l1_0-orientation/diagnostic_starter.mjs`), compare with
your workbook, fix one line at a time and run again. Done when it prints exactly the three lines at the bottom of the
file. `diagnostic_solution.mjs` is your instructor's reference.
