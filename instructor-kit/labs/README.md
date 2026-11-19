# Labs: React Native & Expo: Build and Ship a Mobile App (instructor kit)

One folder per session, `module-NN/` (Session 7 = `module-07`), and in it one folder per lesson,
`lM_N-<slug>/` (`l2_1-view-text-and-stylesheet`). Session 1 also has `l1_0-orientation/` (the environment check
and the diagnostic practice). Each session folder has a `README.md` for learners.

**Where learners keep them:** copy the kit's whole `labs/` folder into the course folder once
(`shoreline/labs/`), next to `shoreline-api/` and `shoreline-crew/`, then run `npm install` ONCE in
`shoreline/labs`: `labs/package.json` + `labs/package-lock.json` hold every package every lab uses (Expo SDK 58, the
course app's libraries, Jest, MSW, TypeScript, ESLint; about 1,400 packages, 1.1 GB, 20 to 40 s from a warm npm
cache). Lab folders have no dependencies and no lockfile of their own: Node, Jest, tsc, ESLint and Metro find the
packages in `labs/node_modules`, three folders up (`labs/module-NN/<lab>/starter`). Hand out the `starter/` folders and the
`TASKS.md` sheets; keep the `solution/` folders until the session is over. A lab never runs inside
`shoreline-crew/`: when a lab practices on the course app, its task sheet says which files to copy in and how to
remove them again.

**No phone, emulator or simulator is needed for any lab.** The labs run headless: Jest with jest-expo's React
Native preset renders the components the way React Native does (no browser, no DOM), React Native Testing Library
14 queries them the way a screen reader meets them, MSW 3 answers `fetch` instead of the API, `tsc --noEmit` and
`npx expo lint` check them, and `npx expo export` proves a lab bundles. What only a phone shows stays in the
lessons, hedged the way the lessons hedge it.

## A lab folder

```
lM_N-<slug>/
├─ TASKS.md        the task sheet: 2 or 3 tasks (new practice, never the lesson's own project), how to run, done-when
├─ lab.json        what labs/check_labs.py runs and expects (below)
├─ starter/        what learners edit (as shipped it fails where it should: tests fail, or tsc/the linter reports it)
├─ solution/       the reference (passes: tests, the type check, the linter)
├─ fixtures/       optional: real API answers saved once from shoreline-api (labs run without a server)
└─ debug_*         optional: a handout with deliberate bugs (never named starter or solution)
```

Lab `starter/` and `solution/` folders carry a `package.json` WITHOUT dependencies (scripts and the Jest config
only), a `tsconfig.json` and the other project files, never a lockfile or `node_modules`. The test script runs
`../../../node_modules/jest/bin/jest.js`, so a lab folder sits exactly three levels under `labs/`
(`module-NN/<lab>/<dir>`, `projects/<project>/<dir>`). Measured on the shared install from inside a starter: `npm
test` (jest-expo preset, the course's Node-fetch environment, MSW 3 under `--experimental-vm-modules`), `npm run
typecheck` (`expo/tsconfig.base` resolved upward), `npm run lint` (eslint-config-expo resolved upward), `npx expo
export -p web` and `npx expo start` (Metro resolves the parent `node_modules` with its default config; no
`metro.config.js` needed). Two shapes, both from the kit tools' `lab_templates/`:

- **React Native, tested headless** (`lab_templates/rn-jest/`): Expo SDK 58 (expo 58.0.25, React Native 0.88.1,
  React 19.3.0), Jest 30.5 with jest-expo 58, React Native Testing Library 14.1 (`await render(...)`), MSW 3.0.5,
  TypeScript 6.0.3 (the SDK's), ESLint 9 with eslint-config-expo 58, and the course's own `jest.environment.js` +
  `jest.setup.ts` (Lesson 8.2: Expo SDK 58 replaces `fetch` with a phone-only one; they put Node's back so MSW can
  answer). `npm test` runs Jest ONCE (the course app's script adds `--watchAll`; labs leave it out),
  `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `expo lint`, `npm run web` shows the lab's `App.tsx` in
  the web preview (optional).
- **TypeScript on Node** (`lab_templates/ts-node/`): plain TypeScript with no React Native (the shared code from
  Shoreline Crew HQ, dates, validation): Node 24 runs the `.ts` files directly, `node --test --test-reporter=spec`
  runs every `*.test.ts`, `npm run check` is `tsc --noEmit` (TypeScript 6.0.3).

A package that is not in `labs/package.json` is a request to the coordinator (one shared install, never a lab's
own lockfile: check_labs FAILS a lab folder with a lockfile or dependencies). Jest and
node:test run the code without checking types: a solution that passes its tests but fails `tsc` is wrong, so every
lab with a `tsconfig.json` has a `solution-types` run.

## lab.json

```json
{"title": "React Native's building blocks", "lesson": "1.1", "tasks": 3,
 "runs": [
   {"name": "starter",  "dir": "starter",  "cmd": "npm test", "exit": "nonzero", "expect": ["Tests:       4 failed, 4 total"]},
   {"name": "solution", "dir": "solution", "cmd": "npm test", "exit": 0, "expect": ["Tests:       4 passed, 4 total"]},
   {"name": "solution-types", "dir": "solution", "cmd": "npm run typecheck", "exit": 0, "absent": ["error TS"]},
   {"name": "solution-live", "dir": "solution", "cmd": "node src/countUpcoming.ts", "env": {"API_URL": "{API}"},
    "api": true, "expect": ["8 upcoming cleanups"]}]}
```

| Key | Meaning |
|---|---|
| `name` | unique; runs named `starter*` must fail where they should (`"exit": "nonzero"` or an `expect` text such as the TODO line); runs named `solution*` exit 0 |
| `dir` | the folder the command runs in (relative to the lab folder); the shared install is in place before it runs |
| `cmd` | a bash command line, run in a terminal (pty) like a learner's; `{API}` = the address of the run's API, `{METRO}` = a port for `npx expo start --port {METRO}` or `npx expo serve --port {METRO}` |
| `exit` | `0` (default), a number, or `"nonzero"` |
| `expect` / `absent` | texts the output must / must not contain (the API's address appears as `{API}` in the output) |
| `files` | `{"src/x.ts": "..."}`: files written into `dir` before the run (`{API}`, `{METRO}` substituted) |
| `env` | extra environment variables (`{API}`, `{METRO}` substituted) |
| `api` | `true` or `{"args": ["--latency=300"], "today": "2026-06-15"}`: the run needs shoreline-api. The checker starts a PRIVATE copy on its own port (44NN for Session NN), never the learners' 4000, and stops it afterwards. Sample data is built around `today` (default 2026-06-15, so outputs do not change from day to day; `null` = the real date). The EXCEPTION, not the rule: prefer MSW or `fixtures/` |
| `course` | `"lesson-02-end"` (+ `"into": "shoreline"`): copy that course download (the course repo's `downloads/<name>/`) into `<dir>/<into>/` first, with each project's packages installed from its lockfile: a learner's course folder at that point, for checks that need one (Session 1's environment check). Skipped when the downloads are not on the machine |
| `tty` | `false`: a plain pipe instead of a terminal (default: a terminal, unless the command starts a background job) |
| `timeout` | seconds (default 240) |

Rules the checker enforces (`lint_lab`): no reserved port in a run (4000 and 8081 are the learners', 4300 and
4381 to 4384 the course tools'); `npx expo start`/`serve` only on `{METRO}`; no `npm test` on a script that watches
(`--watchAll`) unless the run adds `-- --watchAll=false`; no `node_modules` in the kit. A run that leaves a process
running in its folder (a Metro, a server) FAILS: the checker stops it by PID and says so.

## Running the checks

```bash
python3 labs/check_labs.py module-01            # every lab of Session 1 (from the kit folder)
python3 labs/check_labs.py module-01/l1_2-your-toolchain -v     # one lab, with each run's output
python3 labs/check_labs.py --all                # the whole kit
python3 labs/check_labs.py module-01 --no-api   # skip the runs that need shoreline-api
python3 labs/check_labs.py module-01 --api http://localhost:4000   # use YOUR running API instead of a private one
python3 labs/check_labs.py module-01 --api-dir ~/shoreline/shoreline-api   # which shoreline-api to start
```

The checker mirrors the learner's layout: each run copies the lab to `<copy>/labs/module-NN/<lab>/` with the kit's
`labs/package.json` + lockfile installed as `<copy>/labs/node_modules`. Needs Node 24 (the course tools' `~/.nvm/versions/node/v24.22.2/bin` if it exists, otherwise the `node` on your
PATH; or set `RN_NODE=/path/to/node/bin`). Every run works in a fresh copy of the lab folder under
`~/.cache/rn/kit-work/` (removed afterwards); the shared lockfile (and a course download's own, for `course` runs)
is installed once into `~/.cache/rn/kit-nm/` (1,384 packages, 1.1 GB, 19 s from a warm npm cache) and hard-linked
into the copies (about 2 s per run). Runs with `api` start shoreline-api from the course tools' copy or, on an instructor's machine without them,
from `shoreline-api/` next to this `labs/` folder (`shoreline/shoreline-api` when `labs/` sits in the course
folder) or `--api-dir`. Several checkers can run at once: each session has its own ports. With `--api URL`, runs
that start the API with their own flags (`args`) are skipped.
