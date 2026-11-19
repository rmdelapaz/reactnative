# Lab 9.3: Updates and Monitoring

New practice on the lesson's ideas (not the lesson's project): which phones an update reaches, a crash reporter
that keeps personal data on the phone, and a CI workflow with three classic mistakes. Plain TypeScript on Node: no
phone, no Expo account, nothing is published.

**Setup:** the shared lab install (`npm install` once in `shoreline/labs`; nothing to install here). A terminal in
`starter/`. Run `npm test` after every change, and `npm run check` (tsc) at the end.

| Command | What it does | Done when |
|---|---|---|
| `npm test` | `node --test` runs `reach.test.ts`, `scrub.test.ts`, `ci.test.ts` | `ℹ pass 9` and `ℹ fail 0` |
| `npm run check` | `tsc --noEmit` | nothing after its two `>` lines |

**Task 1: who gets the update?** (`reach.ts`) `takesUpdate` checks the channel only, the way a team that forgets
runtime versions thinks. The tests list five phones: a development build, Lesson 9.2's preview (no expo-updates),
an older preview whose native part differs, the current preview, the store app. Make `takesUpdate` say what
expo-updates really does: which two other facts decide? Done when the three Task 1 tests pass.

**Task 2: a reporter that scrubs** (`scrub.ts`) A report can carry a volunteer's email or sign-in key. Write
`scrub` (emails become `[email]`, the key after `Bearer ` becomes `[key]`) and `scrubbing(send)`, a Reporter that
sends a scrubbed COPY of the error (same name) and leaves the original alone. In the course app this would plug in
once: `setReporter(scrubbing(send))`, with no screen changed. Done when the three Task 2 tests pass.

**Task 3: repair the workflow** (`.github/workflows/ci.yml`; names that start with a dot may be hidden in your
file manager, VS Code shows them) Tidepool Count's workflow has three mistakes: an install that may pick other
versions than the lockfile, a type check that fails on every fresh checkout, and tests that never stop. Fix the
YAML, not the test. Done when `ℹ pass 9`, `ℹ fail 0`, and `npm run check` prints nothing.

**Debrief questions:** Which phone in Task 1 shows the "Updating the build from Lesson 9.2" mistake, and which the
"Publishing without the variant's settings" one? Why must `scrubbing` send a copy? On which computer would Task 3's
type-check mistake never show, and why?
