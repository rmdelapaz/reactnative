# Lab 5.1: addresses as data

New practice on Lesson 5.1's ideas (not the lesson's own `address.ts` or Connection section): an address is data you
can check before anything is sent, the right address depends on the device, and a request to the wrong address
should give up and say which address it tried. Everything is plain TypeScript, tested with Jest; MSW plays the
computers on the network (`fixtures/health.json` is a real `GET /api/health` answer). No phone, no running API.

**Setup:** the course's one lab install (`npm install` once in `shoreline/labs`). Then a terminal in
`labs/module-12/l5_1-reaching-the-api-from-a-phone/starter` and `npm test`: six of the seven tests fail (only "a computer that answers" passes), and the Task 3 time
limit test waits five seconds first (Jest's own limit): that wait is the bug.

## Task 1: read .env.local like a teammate would (src/env.ts)

`readApiAddress(envText)` gets the whole text of a `.env.local` file. Ignore blank lines and lines starting with
`#`, find the `EXPO_PUBLIC_API_URL` line, and return `{ address }` (trailing slashes removed) or `{ problem }`, checking
in this order: the line is missing; it is there more than once; there are spaces around the `=`; the value does not
start with `http://` or `https://`; the value ends with `/api`. The tests hold the exact sentences. Done when both
Task 1 tests pass.

## Task 2: the lesson's address table, as code (src/devices.ts)

`directionsFor(device, lan)` returns the address and the API command for the web preview, the iOS Simulator, the
Android emulator and a phone (only a phone needs your computer's address and `--host`). `lanProblem(lan)` says why an
address cannot work as a phone's way to your computer: empty, `localhost` or `127.…` (the phone itself), `172.…`
(WSL's private address). Done when both Task 2 tests pass.

## Task 3: a health check that gives up and names the address (src/health.ts)

`checkHealth(base, timeoutMs)` asks `${base}/api/health`. Add an `AbortController` with a timer that aborts after
`timeoutMs` (clear the timer when the request is done), and return messages that name `base`: a refusal, a non-OK
status, and a request that never answered. Done when `npm test` says `Tests:       7 passed, 7 total`, and
`npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Think about it:** in which test did the starter wait, and what would a volunteer on the beach have seen meanwhile?
Why is `signal.aborted` the way to tell "too slow" from "refused"?
