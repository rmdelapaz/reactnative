# Rubric: Bookmobile Stops (Tamarack County Library Bookmobile), the Part 2 project

Six rows, each 0 (not yet), 1 (meets) or 2 (strong): 12 points, the same scale as the final project's
rubric (Lesson 10.1). **Part 2 project complete = no row at 0.** The total is recorded; there is no other threshold.

| Criterion | Not yet (0) | Meets (1) | Strong (2) |
|---|---|---|---|
| R1 Routing and tabs | Tabs or the stop screen missing, or an unknown stop id crashes the screen | Four tabs; `/stops/[id]` reads its id and says when a stop does not exist; a not-found screen | Plus: the anchor gives a linked stop a back button to the list; titles set from the data; a deep link tested in the web preview |
| R2 Simple sign-in and a protected tab | No sign-in, or the Holds tab shows (or requests) holds for a guest | Card number + PIN sign-in; session in SecureStore (memory on the web); sign-in modal guarded; Holds has a guest face | Plus: a saved session is checked before use; a 401 after an API restart signs the patron out cleanly; the PIN is cleared after a failed try |
| R3 Data from the mock API | fetch outside the client, or answers used without a guard, or a data screen with no error face | Typed client + guards; Query for every read; loading / error with Try again / empty / list on Stops; pull to refresh | Plus: query keys carry the viewer where the answer depends on it; refresh on focus; the API's own words shown for a 4xx |
| R4 Offline-safe storage | Holds are lost when the app closes offline, or a resend makes a second hold | Persisted queue with a clientId per hold; sent when online; refused holds kept with the server's words; My stop saved and read back | Plus: saved data checked when read back (a bad saved value cannot crash the app); only the owner's sign-in sends a hold; a waiting count on the Holds tab |
| R5 The form and the device feature | No form validation, or the location question pops up at startup, or a no breaks the screen | React Hook Form + Zod with messages under the fields; nearest stop asked after a press and an explanation; a no handled | Plus: My stop picked in the form already; the blocked face points to Settings (and the browser's site settings); "Make this my stop" from the answer |
| R6 Quality | Does not type-check, or lint errors, or failing tests, or no NOTES.md | tsc clean, lint 0 problems, every test passing, `npx expo export` web/android/ios, NOTES.md | Plus: accessibility labels and roles a screen reader can use everywhere; a test of your own; dark mode checked |

**Part 2 met = the Bookmobile Stops project complete under its rubric (no row at 0) AND the Part 2 assessment met (14 or more of 20 points, 70 %).** Below either line: a written next step and one resubmission / retake within two weeks.
