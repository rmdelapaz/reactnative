# Lab 9.4: The App Stores

New practice on the lesson's ideas (not the lesson's project), for Tidepool Count, a made-up citizen-science app:
a store-listing checker and privacy answers from a data inventory. Plain TypeScript on Node: no store account, no
phone, nothing is submitted. This folder also holds the session's **launch-readiness check** (`launch_check.mjs`,
see the end).

**Setup:** the shared lab install (`npm install` once in `shoreline/labs`). A terminal in `starter/`.

| Command | What it does | Done when |
|---|---|---|
| `npm test` | `node --test` runs `listing.test.ts` and `privacy.test.ts` | `ℹ pass 6` and `ℹ fail 0` |
| `npm run check` | `tsc --noEmit` | nothing after its two `>` lines |

**Task 1: check the listing** (`listing.ts`) `listingProblems` knows the stores' limits from the lesson's table,
with two mistakes: it counts keywords in characters (App Store Connect counts BYTES: an é is two), and it gives
Google Play's short description the wrong limit. Fix both. Done when the three Task 1 tests pass.

**Task 2: answer the privacy form** (`privacy.ts`) `answerFor` calls everything the app touches "collected". Use
both stores' definition (it leaves the phone AND is kept), then write `deletionInApp`: when do both stores require
deletion that starts inside the app? Done when `ℹ pass 6`, `ℹ fail 0`, and `npm run check` prints nothing.

**Debrief questions:** Which item of Tidepool Count's inventory would a "from memory" answer get wrong, and in
which direction? Shoreline Crew does not create accounts: why does it have an Ask to delete my account button
anyway?

## The launch-readiness check

From your course folder `shoreline` (not from this lab): `node labs/module-24/l9_4-the-app-stores/launch_check.mjs`.
It changes nothing and needs no network or account. It reads `shoreline-crew` and prints OK, CHECK, FIX and NOTE
lines, a DO BY HAND list (the phone test on the same Wi-Fi and its fallbacks, the push to GitHub), and ends with
READY, READY WITH NOTES or NOT READY. An Expo account is optional; store accounts and paid developer accounts are
NOT required, for the course or to pass it.
