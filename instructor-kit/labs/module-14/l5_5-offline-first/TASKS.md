# Lab 5.5: an outbox of hazard reports

New practice on Lesson 5.5's ideas, on something the lesson did not build: a volunteer who sees broken glass, an
animal in trouble or a strong current reports it at once, signal or not. The report goes into a queue saved on
the phone, a sender empties the queue when it can, and a Not sent yet list shows what is still waiting. The
endpoint `POST /api/sites/:siteId/hazards` is practice: MSW answers it in the tests (each beach in the tests gets
one kind of answer: 201, 200, 403, 401, 503 or no answer at all). shoreline-api is not needed.

**Setup:** a terminal in `labs/module-14/l5_5-offline-first/starter` (the shared lab install: nothing to install).
Run `npm test`: every test fails, most with the same message. Read it from the top.

## Task 1: the queue saves itself (src/hazardQueue.ts)

The store was copied from the web course, where `persist` saves in localStorage unless told otherwise. A phone
has no localStorage, and the very first change fails: that `TypeError` is the red screen a phone would show at
the first Send. Name the storage (`createJSONStorage(() => AsyncStorage)`), and save only `reports`: `sending`
("a send is running right now") must start as `false` after a restart. Done when both Task 1 tests pass. Every
other test uses the store, so do this one first.

## Task 2: every answer means something (src/sendReports.ts)

The sender treats every failure the same: "try again later". That keeps a refused report forever and keeps
sending with a sign-in that has ended. Sort the answers, as in the lesson's Safe Retries table: 201 or 200 =
done (already written), 401 = call `onSignInEnded`, keep everything and stop, any other `ApiError` under 500 =
refused with the server's message (never sent again by itself) and go on with the next report, anything else (no
answer, 5xx) = count the try and stop. Ask of each answer: would asking again, unchanged, ever get a different
answer? Done when every Task 2 test passes.

## Task 3: the Not sent yet list (src/NotSentList.tsx)

The list renders forever ("Maximum update depth exceeded"): its selector builds a new array every time Zustand
asks. Wrap it in `useShallow`. Done when `npm test` says `Tests:       8 passed, 8 total`, and `npm run typecheck`
and `npm run lint` print nothing after their two `>` lines.

**Stretch:** which test proves that a resend after a lost answer is harmless, and what makes it harmless on a real
server? (Hint: the lesson's 200 row, and the field every report carries from the moment it is written.)
