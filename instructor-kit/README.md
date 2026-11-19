# React Native & Expo: Build and Ship a Mobile App: Instructor Kit ("Course-in-a-Box")

A ready-to-teach package that lets another instructor deliver **React Native & Expo: Build and Ship a Mobile App**
in a classroom without building it from scratch. The live course site (<https://rays-reactnative.netlify.app/>)
is the learner's textbook: 37 lessons in 10 modules (90 hours 15 minutes of learner time), each with real output
under every code block (run with Node.js 24 LTS, Expo SDK 58 (expo 58.0.25), React Native 0.88.1, React 19.3.0,
Expo Router 58.0, TypeScript 6.0.3 (the SDK's), TanStack Query 5.107, Zustand 5.1, React Hook Form 7.92, Zod 4.6,
Reanimated 4.7, FlashList 2.3, Jest 30.5 with jest-expo 58, React Native Testing Library 14.1 and MSW 3.0.5, and
EAS CLI 27), project code checked against the files of each lesson's finished stage (type check, `expo lint`, Jest,
`expo export` for web, Android and iOS, and browser checks of the web preview), starting and finished code
downloads, exercises with hidden solutions, a quiz and a journal prompt. One project runs through every lesson:
**Shoreline Crew**, the volunteers' phone app of the fictional **Shoreline Crew**, a volunteer beach-cleanup group,
talking to `shoreline-api`, the same small typed mock API as the prerequisite course's web app, Shoreline Crew HQ
(no dependencies, started with `node server.ts`). This kit is everything the instructor needs around it.

**Scope:** the whole course, Modules 1 to 10: how React Native draws native views and what Expo adds, a toolchain
(Node, VS Code with Expo Tools, the mock API, an Expo SDK 58 project in Expo Go or the web preview) and the shared
code that comes over from the web app; core components and layout (View, Text and StyleSheet, flexbox, images,
icons, fonts and safe areas, touch and input, responsive, platform-specific and themed UI); fast lists (FlatList,
SectionList, FlashList); Expo Router (file-based routes, tabs and modals, sign-in flows and protected routes, deep
links); data on a phone (reaching the API, TanStack Query, storage on the device, mobile forms, offline first);
device features (permissions, camera and photos, location and maps, notifications, haptics, sharing and files);
animation with Reanimated 4, gestures and motion polish; accessibility; tests with Jest, React Native Testing Library
and MSW; performance and debugging; app config, development builds and EAS Build, updates and monitoring, the app
stores; a final project and real mobile projects. **Learners know React and TypeScript and are new to mobile** (the
prerequisite is the React + TypeScript course, or React 19, TypeScript, TanStack Query, Zustand, React Hook Form with
Zod and a test runner); no Swift, Kotlin, Mac or mobile experience is needed. Session 1 opens with a short, ungraded
readiness diagnostic.

**Format:** **26 sessions × 3 hours = 78 class hours** in **three parts**, one or two lessons per session.
Sessions 2 to 7, 20, 21 and 23 teach one lesson and give the rest of the time to the longer lesson project, a
checkpoint or build planning; Sessions 9, 17 and 26 teach none (part project check-ins, assessments, the showcase).

- **Part 1: Foundations and Lists** (Sessions 1 to 9, Modules 1 to 3, **27 hours**, 10 lessons) takes a React
  developer from the web to a styled, themed, interactive phone app with fast lists. It **runs on its own as a
  short course** and ends with the **Part 1 project and assessment** (Session 9).
- **Part 2: Navigation, Data and Devices** (Sessions 10 to 17, Modules 4 to 6, **24 hours**, 14 lessons) gives
  Shoreline Crew a router, a sign-in, real data that survives a dropped connection and the phone's features, and
  ends with the **Part 2 project and assessment** (Session 17).
- **Part 3: Motion, Quality and Shipping** (Sessions 18 to 26, Modules 7 to 10, **27 hours**, 13 lessons) adds
  motion, accessibility, tests, performance and a store-ready build, and ends with the **final project showcase
  and the final assessment** (Session 26).

Run it weekly (26 weeks; Part 1: 9, Part 2: 8, Part 3: 9), twice a week (about 13 weeks), or as three separate
blocks. The final project needs about 30 hours (usually 25 to 35) over four to six weeks between Sessions 25 and 26
(`final-assessment.html` says what to do when Session 26 must come sooner). In the file layout a session is called
a "module": `source/module-09/` is Session 9. In prose, "Module 3" always means a course module (Lists).

Learners start each lesson project in the room and finish it at home, so "leave with" below means "have started
in class and finish before the next session".

| Session | Lessons | Learners leave with |
|---------|---------|---------------------|
| **Part 1: Foundations and Lists** | | |
| S1 · How React Native Works and Your Toolchain | 1.1 How React Native Works · 1.2 Your Toolchain (+ welcome, environment check, diagnostic, install clinic) | Node 24+ and VS Code with Expo Tools; a course folder `shoreline` with `shoreline-api` running on port 4000, `shoreline-crew` created with `npx create-expo-app@latest` and the kit's `labs/` installed once; `check_environment.mjs` says READY; the app open in Expo Go or the web preview, reset, with its first screen; a style typo the phone ignores and tsc names |
| S2 · From the HQ to the Phone | 1.3 From the HQ to the Phone | The web app's shared code on the phone (API types, type guards, error helpers, dates, availability), a `NetworkError` for the phone's fetch, `EXPO_PUBLIC_API_URL` in `.env.local` and the first real request |
| S3 · View, Text and StyleSheet | 2.1 View, Text and StyleSheet | Theme files, `AppText`, `EventCard` and the Cleanups screen; the CSS habits that are loud (tsc names them) and silent (a phone ignores them) |
| S4 · Flexbox the Native Way | 2.2 Flexbox the Native Way + **Checkpoint 1** (30 min) | A `Screen` component, `Badge` and `StatusBadge`, the card's rows in column-first flexbox; Checkpoint 1 on Modules 1 and 2 so far |
| S5 · Images, Icons, Fonts and Safe Areas | 2.3 Images, Icons, Fonts and Safe Areas | The Outfit font behind the splash screen, safe areas in `Screen`, an `Icon` component and the beach pictures on the cards |
| S6 · Touch and Input | 2.4 Touch and Input | `Button` on Pressable with press feedback and 48-point targets, Show details on every card, a `SearchField` and a `SwitchRow`, a filtered Cleanups screen with its empty state |
| S7 · Responsive, Platform-Specific and Themed UI | 2.5 Responsive, Platform-Specific and Themed UI | Light and dark palettes that TypeScript keeps complete, `useTheme` on every component, the status bar, two columns from 700 wide |
| S8 · FlatList, SectionList and Big Lists | 3.1 FlatList and SectionList · 3.2 Big Lists, Fast (+ Part 1 project kickoff) | The Cleanups list as a FlatList with every state, pull to refresh and Group by date, then one FlashList with paging; the Part 1 project started |
| S9 · Part 1 Project Check-in and Assessment | — (project check-in, the **Part 1 assessment**, demos, review) | The Part 1 project presented; a scored Part 1 assessment. Part 1 alone: the course closes here |
| **Part 2: Navigation, Data and Devices** | | |
| S10 · File-Based Routing, Tabs and Modals | 4.1 File-Based Routing · 4.2 Tabs, Nesting and Modals (+ Part 1 refresher, "starting with Part 2" catch-up) | A typed stack with header options, the cleanup screen opened by its address, a not-found screen; four tabs in a `(tabs)` group and a modal |
| S11 · Sign-In Flows and Deep Links | 4.3 Sign-In Flows and Protected Routes · 4.4 Deep Links | A session kept in SecureStore, a guard with `Stack.Protected`, a Sign in modal, Profile and My cleanups; the app's own links, the tabs underneath a linked screen and Share this cleanup |
| S12 · Reaching the API and TanStack Query on Mobile | 5.1 Reaching the API from a Phone · 5.2 TanStack Query on Mobile | The API with `--host` and the computer's address, a Connection check; TanStack Query with the phone's focus and online managers, sign-up and cancel as mutations |
| S13 · Storage and Mobile Forms | 5.3 Storing Data on the Device · 5.4 Mobile Forms + **Checkpoint 2** (30 min) | Settings in AsyncStorage, a logbook in SQLite; React Hook Form + Zod on sign-in and the Log debris form with the right keyboards; Checkpoint 2 on Modules 4 and 5 so far |
| S14 · Offline First and Permissions | 5.5 Offline First · 6.1 Permissions Done Right | A persisted Zustand queue that sends waiting logs when the phone is back online; a `usePermission` hook and a permission gate, first used for location |
| S15 · Camera, Photos, Location and Maps | 6.2 Camera and Photos · 6.3 Location and Maps | Photos from the camera or the library on the debris log, waiting in the queue; check-in with an organizer's code, a map with a web stand-in and Open in Maps |
| S16 · Notifications, Haptics, Sharing and Files | 6.4 Notifications · 6.5 Haptics, Sharing and Files (+ Part 2 project kickoff) | Local reminders the evening before a cleanup; haptics on two outcomes, a logbook CSV shared as a file; the Part 2 project started |
| S17 · Part 2 Project Check-in and Assessment | — (project check-in, the **Part 2 assessment**, demos, review) | The Part 2 project presented; a scored Part 2 assessment |
| **Part 3: Motion, Quality and Shipping** | | |
| S18 · Animation and Gestures | 7.1 Animation with Reanimated 4 · 7.2 Gestures (+ Parts 1–2 refresher, "starting with Part 3" catch-up) | Four counting tallies on the UI thread that respect Reduce Motion; swipe to remove a waiting log, with a Remove button for everyone |
| S19 · Motion Polish and Accessible Apps | 7.3 Motion Polish · 8.1 Accessible Mobile Apps | Layout animations, a Lottie log-sent mark and an in-app Reduce motion switch; an accessibility audit of the whole app (web tools and a screen reader) with its fixes |
| S20 · Testing the App's Logic | 8.2 Testing the App's Logic | Jest with jest-expo in the app, the course's Node-fetch test environment, MSW with the API's own handlers; tests for the schemas, the CSV, the queue and the sender |
| S21 · Testing Screens and Flows | 8.3 Testing Screens and Flows + **Checkpoint 3** (30 min) | React Native Testing Library tests by role and name, screens under the router with MSW, a Maestro flow written (not run): 45 tests; Checkpoint 3 on Modules 7 and 8 so far |
| S22 · Performance, Debugging and App Config | 8.4 Performance and Debugging · 9.1 App Config and Environments | The debugger and React DevTools, a bug reproduced by a test first, a smaller bundle; `app.config.ts` with development, preview and production variants and an https guard |
| S23 · Development Builds and EAS Build | 9.2 Development Builds and EAS Build | `expo-dev-client`, `eas.json` with a profile per variant and a profile test; with an optional free Expo account, two Android builds |
| S24 · Updates, Monitoring and the App Stores | 9.3 Updates and Monitoring · 9.4 The App Stores (+ launch-readiness check) | `expo-updates` with channels, a crash screen and one reporting seam, a CI workflow; a Your data screen, store-ready config and a release checklist (no store account, nothing paid) |
| S25 · Final Project Workshop and Real Mobile Projects | 10.1 Final Project · 10.2 Working on Real Mobile Projects | A chosen brief, a charter and the final-project starter green on their laptop; estimates as ranges, the health check and drift; milestone dates, a reviewer and a showcase slot |
| S26 · Final Project Showcase and Final Assessment | — (evidence check, showcase, the **final assessment**, retrospective) | A presented final project; the written final assessment |

**Why this shape (and the timing trade-off):** the lessons were written and timed honestly for a solo learner at
125 to 160 minutes each, so two of them come to more than the roughly 150 room minutes left once the warm-up,
break and wrap-up are out. They do not fit whole, and the kit does not pretend they do. The room protects what is
hardest alone: the **mental model**, a **live demo** learners type along with, the **guided lab** (new practice
on the lesson's ideas, never the lesson's own project) and **starting** each lesson project together. Home gets
the rest: finishing the lesson projects, the exercises, quiz and journal, about two to three hours between
sessions (the final project about 30 hours after Session 25). Every facilitator guide says, for its session, what
is done in the room, what goes home, what to protect and what to cut first if you run long.

Every session runs 0:00 to 3:00 with one 10-minute break: a warm-up (retrieval questions and a check that every
laptop is at the state the session starts from), the lessons (frame, demo, guided lab, project start) and a
wrap-up (exit ticket, homework, the next session's bring list). Session 1 opens with 30 minutes of welcome,
environment check and diagnostic, and Lesson 1.2's room time is an install clinic; Session 10 opens with a Part 1
refresher and the catch-up check (15 minutes), Session 18 with a Parts 1 and 2 refresher and the catch-up check
(25 minutes); Session 24 opens with the launch-readiness check. Checkpoints 1, 2 and 3 (30 minutes each) sit in
Sessions 4, 13 and 21.

**No phone is needed to teach the kit or to pass it.** No phone, emulator or simulator was used to make it: the
labs run headless in Jest and Node, the web preview shows the app on the projector, and what only a phone shows
(Expo Go connecting, native controls, the camera, notifications, a screen reader) is described the way the lessons
describe it, from Expo's, Apple's and Google's documentation, and says so. Learners with a phone use Expo Go;
learners without one use the web preview (the Android emulator and, on a Mac, the iOS Simulator are optional). On
Windows and Linux there is no iOS Simulator and no local iOS build: an iPhone with Expo Go, or EAS in the cloud
(Module 9), covers iPhone.

### Teaching one part, or two

Each part **runs as its own block**. Nothing in a part depends on a later one, and no part needs Docker, a
database server or any back end other than the course's own `shoreline-api` (and the Part 2 project's own small
mock API).

- **Part 1 alone** (Sessions 1 to 9, 27 hours) is a complete short course: the toolchain, the shared code from the
  web app, core components and layout, touch and input, themes and fast lists. Session 9's facilitator guide closes
  either the course (completion, next steps, evaluation) or Part 1 (Part 2 preparation as homework).
- **Part 2 alone, or joining at Part 2** (Sessions 10 to 17): learners need core components, layout, input and
  lists in an Expo app, from Part 1 or elsewhere. Session 10 opens with a Part 1 refresher and the catch-up.
  **Catch-up code:** the course download `lesson-11-start.zip` (the finished code of Lesson 3.2: `shoreline-api`
  and `shoreline-crew`), unzipped into a fresh `shoreline` folder with the kit's `labs/` next to it, `.env.example`
  copied to `.env.local`, `npm ci` in `shoreline-crew`, the API started with `node server.ts`, then the environment
  check in `labs/module-10/l4_0-starting-with-part-2/` (its `lab.json` proves the check says READY on that
  download), `npx tsc --noEmit` and `npx expo lint` clean, and the Cleanups list in the web preview.
- **Part 3 alone, or joining at Part 3** (Sessions 18 to 26): learners need an Expo Router app with data, storage
  and device features. Session 18 opens with a Parts 1 and 2 refresher and the catch-up. **Catch-up code:**
  `lesson-25-start.zip` (the finished code of Lesson 6.5), the same steps, and the check in
  `labs/module-18/l7_0-catch-up/`; then sign in as the sample volunteer to reach where Lesson 7.1 begins.
- **Two parts as one block:** Parts 1–2 (17 sessions, 51 hours) or Parts 2–3 (17 sessions, 51 hours).

The setup guide's **Joining Part 2 or Part 3** section has the learner version of these steps; send it a week
ahead to newcomers. `shoreline-api.zip` on the course site is the API on its own, for anyone who has nothing yet.
The sell sheet and `LICENSE.md` price the full program, two consecutive parts, and each part on its own.

### Primary documents: the combined books (start here)

| File | Audience | Contents |
|------|----------|----------|
| `participant-workbook.{html,pdf}` | Learner | The complete workbook: all 26 sessions as chapters with Part dividers (goals, key ideas, worked examples, guided-lab steps, predict-then-run items, a 12-item self-check, homework checklist; Session 1's Start Here page with the environment checklist and the diagnostic; the Part 2 and Part 3 catch-up checklists; Session 24's launch-readiness checklist; the checkpoint pages; the part project and final project pages) |
| `facilitator-guide.{html,pdf}` | Instructor | The complete teaching manual: per session, Before the Session (prep checklist, files, known environment traps), the 0:00–3:00 agenda, warm-up with answers and the state check, lesson plans with live-demo scripts (every command run for real in a learner's terminal, with its output), the mistakes to expect, checks for understanding, closing (exit ticket, homework, next bring list) and "If you run long or short" |
| `answer-key.{html,pdf}` | Instructor | Every self-check item answered with reasons, lab solution notes with the solutions' real output, the lesson pages' own quiz answers, warm-up, diagnostic, exit-ticket and checkpoint answers with rubrics (confidential) |

**Self-check items:** 12 per session, 26 × 12 = **312**, every one answered in the answer key. The workbook quiz,
the answer key and the guide's compact answers are generated from one item list per session and are checked to
match word for word, with the correct letters balanced.

The editable per-session docs live in `source/module-NN/`. **They are generated** (see "Editing and building"):
change a session through its generator, then run `python3 build-combined.py` to regenerate the three books and
re-render their PDFs.

### Kit-wide documents

| File | Audience | Purpose |
|------|----------|---------|
| `setup-guide.html` | Learner (+ a facilitator page) | Before-you-begin guide, the same steps as Lesson 1.2: Node.js 24 LTS, VS Code with Expo Tools, the course folder `shoreline` with `shoreline-api` unzipped and running, `shoreline-crew` created with `npx create-expo-app@latest`, Expo Go on a phone or the web preview, `labs/` with its one shared install, and the environment check; when the phone cannot connect; common install problems; the internet each session needs; the accounts (none paid); **Joining Part 2 or Part 3**; and a room, network and demo-machine checklist. Send it a week before Session 1 |
| `quick-setup.html` | Learner | Two-page quick setup: Node, VS Code, the course folder, the API, the Expo project, the labs install, the check. Send it with the full setup guide |
| `final-assessment.html` | Instructor | The **Part 1 project and assessment**, the **Part 2 project and assessment** (each for a different fictional client: brief, milestones, rubric, scoring, model-solution notes) and the **final project** (Lesson 10.1's kit and rubric, reproduced exactly, with facilitation, milestones, the showcase and the written final assessment) (confidential) |
| `sell-sheet.html` | Prospective instructors | One-page overview: who it is for, the ways to run it (full program, one part, two parts), outcomes, what is included, license tiers |
| `README.md` · `LICENSE.md` | — | This overview and the tiered license template |

**Slide decks:** one per session in `slides/` (`module-NN-<slug>.html`), 26 to 39 slides each, 843 in all (counts
per session below). Each deck is one self-contained file: open it in a browser, arrow keys or space to advance.
Code on the slides is copied from the course's stage files and checked like lesson code; course screenshots are
referenced from the course's `images/` folder (the kit folder stays inside the course folder), never copied; every
slide fits a 1280×720 projector.

**Labs:** `labs/module-01/` … `labs/module-26/`, one folder per lesson (`lM_N-<slug>/`: `TASKS.md` with two or
three new practice tasks, `lab.json`, `starter/`, `solution/`, optional `fixtures/` and `debug_*` "find the bug"
handouts), each session with a `README.md` for learners. **One shared install:** learners copy `labs/` into their
course folder (`shoreline/labs/`) and run `npm install` ONCE there: `labs/package.json` and its lockfile hold every
package every lab uses (Expo SDK 58, the course app's libraries, Jest, React Native Testing Library, MSW, TypeScript,
ESLint; about 1,400 packages, 1.1 GB); lab folders have no dependencies of their own. Labs run **without a phone and
without a server**: Jest with jest-expo's React Native preset, React Native Testing Library and MSW 3, or TypeScript
on Node with `node --test`, plus `tsc --noEmit` and `npx expo lint`, on real API answers saved in `fixtures/`; the
few that need the API start a private copy of `shoreline-api`. As shipped, every starter fails where it should (a
failing test with a `TODO` message, or the type check or linter reporting the problem) and every solution passes
its tests, its type check and its linter. Session 1 adds the environment check and the diagnostic pair
(`labs/module-01/l1_0-orientation/`); Sessions 10 and 18 the catch-up checks (`l4_0-starting-with-part-2/`,
`l7_0-catch-up/`); Session 24 the launch-readiness check (`labs/module-24/l9_4-the-app-stores/launch_check.mjs`);
Session 26 the final project's evidence check (`labs/module-26/showcase-preflight/evidence_check.mjs`). The
checkpoints live in `labs/module-NN/checkpoint-N/`, the Part 1 assessment's practical in
`labs/module-09/part1-practical/`, and the part projects in `labs/projects/part1-alder-row-repair-cafe/` and
`labs/projects/part2-tamarack-bookmobile/` (brief, rubric, notes, a model solution proved by `check_labs.py`).
Session 17 has no lab folder. The format and the rules are in `labs/README.md`.

**Per session (counted from the decks' `<section class="slide">` elements and the `lab.json` files):**

| Session | Slides | Lab folders | Checked runs |
|---|---|---|---|
| 1 | 33 | 3 | 20 |
| 2 | 30 | 1 | 9 |
| 3 | 31 | 1 | 6 |
| 4 | 32 | 2 | 12 |
| 5 | 30 | 1 | 6 |
| 6 | 29 | 1 | 7 |
| 7 | 29 | 1 | 6 |
| 8 | 36 | 2 | 12 |
| 9 | 26 | 1 | 4 |
| 10 | 34 | 3 | 13 |
| 11 | 31 | 2 | 11 |
| 12 | 35 | 2 | 11 |
| 13 | 35 | 3 | 16 |
| 14 | 34 | 2 | 12 |
| 15 | 39 | 2 | 12 |
| 16 | 37 | 2 | 10 |
| 17 | 28 | — | — |
| 18 | 35 | 3 | 17 |
| 19 | 36 | 2 | 13 |
| 20 | 31 | 1 | 8 |
| 21 | 32 | 2 | 17 |
| 22 | 34 | 2 | 17 |
| 23 | 35 | 1 | 8 |
| 24 | 32 | 2 | 10 |
| 25 | 33 | 2 | 14 |
| 26 | 26 | 1 | 4 |
| Part 1 project (Alder Row Repair Café) | — | 1 | 6 |
| Part 2 project (Tamarack County Library Bookmobile) | — | 1 | 11 |
| **Total** | **843** | **47** | **292** |

**Downloads on the course site** (public, used by the lessons and the kit; the kit never duplicates them):
`shoreline-api.zip` (the mock API: Node runs its TypeScript directly, no install), `lesson-NN-start` and
`lesson-NN-end` (+ `.zip`) for every lesson that changes code (`lesson-02-end` and Lessons 1.3 to 9.4 =
`lesson-03` to `lesson-35`; the catch-up code and the instructor's reset points; Lesson 1.1 runs in Expo Snack and
Lessons 10.1 and 10.2 change no course code), and `final-project-kit/` (+ `.zip`: README, worksheet, seven client
briefs, the rubric, the peer-review checklist and a verified `starter/` with the course's tooling and an in-app mock
API).

The public **syllabus** lives in the course root, one level up from `instructor-kit/`, so it stays public:
`syllabus.html` (screen, light/dark), `syllabus-print.html` (print-first, with the part options noted) and
`ReactNative-Syllabus-26-sessions.pdf`. They are generated (see "Editing and building").

**Still to do before selling:** `LICENSE.md` is a plain-language **template**: have it reviewed by a lawyer
before commercial distribution. Pricing in the sell sheet and the license is a **suggested anchor**: the
bracketed prices are placeholders set at point of sale.

---

## Folder layout

```
instructor-kit/
├─ participant-workbook.{html,pdf}   ← canonical hand-out books (all 26 sessions, Part dividers)
├─ facilitator-guide.{html,pdf}
├─ answer-key.{html,pdf}
├─ setup-guide / quick-setup / final-assessment / sell-sheet  (.html + .pdf)
├─ slides/            one self-contained deck per session: module-NN-<slug>.html (NN = 01 … 26)
├─ labs/              check_labs.py, README.md (the lab format and rules),
│                     package.json + package-lock.json = the ONE shared lab install (npm install in shoreline/labs),
│                     module-01/ … module-26/: per lesson a folder lM_N-<slug>/ (TASKS.md, lab.json,
│                     starter/, solution/, fixtures/, debug_*), a README.md per session;
│                     module-01/l1_0-orientation/ = environment check + diagnostic;
│                     module-10/l4_0-starting-with-part-2/, module-18/l7_0-catch-up/ = catch-up checks;
│                     module-04/, module-13/, module-21/ checkpoint-N/;
│                     module-09/part1-practical/ = the Part 1 assessment's practical;
│                     module-24/l9_4-the-app-stores/launch_check.mjs = the launch-readiness check;
│                     module-26/showcase-preflight/ = the final project's evidence check;
│                     projects/part1-alder-row-repair-cafe/, projects/part2-tamarack-bookmobile/ = the part projects
├─ source/            module-01/ … module-26/ per-session docs (generated; they build the books)
├─ _parts/            the three fragments final-assessment.html is assembled from
├─ kit.css            shared print-first stylesheet (the course site's violet)
├─ build-combined.py  regenerate the 3 books from source/
└─ README.md · LICENSE.md
```

Every document is print-ready (a **Print / Save as PDF** button and a tuned print layout, US Letter) and
readable on a phone.

The whole `instructor-kit/` folder is kept **off the live site**: the course root's `_redirects` returns 404 for
`/instructor-kit/*` and `/instructor-kit`. It lives in the repository only.

## How to teach from it

1. **A week before Session 1**, send learners the **setup guide** (and the two-page quick setup) with the `labs/`
   folder **without the `solution/` folders** and without `labs/projects/`; ask each learner to copy `labs/` into
   their course folder (`shoreline/labs/`), run `npm install` once in `shoreline/labs` (about 1.1 GB: the only lab
   install of the course), start the API (`node server.ts` in `shoreline-api`), run
   `node labs/module-01/l1_0-orientation/check_environment.mjs` from `shoreline` and reply with its last line
   (`READY for React Native & Expo: Build and Ship a Mobile App`, or READY WITH NOTES: "still the template" is the
   expected note before class). No reply means an install risk: chase it.
2. **Hand out** each session's `labs/module-NN/` the same way (also on a USB stick, with the Node installers,
   VS Code, `shoreline-api.zip` and `lesson-02-end.zip`, for a room with slow Wi-Fi). Hold back checkpoint and
   assessment material until the moment it is used.
3. **Before each session**, read that session's facilitator guide: Before the Session (files, the state the
   session starts from, known environment traps), the agenda, each lesson's live-demo script, the mistakes to
   expect, and "If you run long or short". Run `python3 labs/check_labs.py module-NN` once (below).
4. **Present** from the session's deck in `slides/`; type the demos live in your own course folder (VS Code at a
   large font, two terminals named "api" and "crew" at 18 pt or more, the web preview in a browser at phone size
   with DevTools; your own phone with Expo Go, mirrored if you can). Your projector workspace follows the lessons
   like the learners' do; the course's `lesson-NN-start` downloads are your reset points.
5. Learners work in the **participant workbook** and keep a **learning journal**.
6. Check self-checks, warm-ups and exit tickets with the **answer key**; score Checkpoints 1 to 3, the part
   projects and assessments and the final project with their rubrics.
7. **Before Part 2 and Part 3**, send the setup guide's **Joining Part 2 or Part 3** section to anyone joining or
   with a broken course folder. Before Session 12, make sure phones and laptops can share a trusted Wi-Fi (or a
   hotspot): Lesson 5.1 connects the phone to the API. Before Session 23, an Expo account is **optional** (learners
   without one read the build steps and do everything local); before Session 24, ask learners to install Git and,
   if they can, create a free GitHub account. Session 24 opens with the launch-readiness check, which says it out
   loud: an Expo account is optional, and **no store account and no paid developer account** is needed for any step,
   for the final project or to pass.

### The state a session starts from

There is one workspace all the way through: the learner's course folder `shoreline/` with `shoreline-api` (the
mock API, never edited), `shoreline-crew` (the app) and `labs/` (the kit's labs and their one shared install).
Learners who took the React + TypeScript course reuse their `shoreline` folder (the API is the same) and keep
`shoreline-hq` read-only for Lesson 1.3. Every lesson changes `shoreline-crew` a little; the course's stage after
each lesson is the reference (`lesson-NN-start` = the finished code of the lesson before). Every session's warm-up
checks that each laptop is at the state the session starts from, with the fix for the usual differences. The
addresses are the same for everyone: the API at `http://localhost:4000/api` (`node server.ts`; `node server.ts
--host` from Lesson 5.1 for a phone, which then uses the computer's Wi-Fi address), Metro and the web preview at
`http://localhost:8081` (`npx expo start`, then `w`). The API keeps its data in memory: a restart brings the sample
data back, with the cleanups placed around today's date.

All data is fictional: Shoreline Crew, its sites, cleanups, volunteers and organizers, the clients of the part
projects and assessments and of the labs, and the final-project briefs. Email addresses use `example.com`; the
API's sample accounts share the public demo password `shoreline-demo`, for local practice only.

## Checkpoints and assessments

- **Checkpoint 1 (Session 4, 30 minutes):** an individual, open-book task on Modules 1 and 2 so far (a type guard,
  a web card rebuilt for a phone, its layout). Five-row rubric in the guide, model answer in the answer key, code in
  `labs/module-04/checkpoint-1/`. Formative.
- **Checkpoint 2 (Session 13, 30 minutes):** Modules 4 and 5 so far (a route and its id, a query's error state,
  favorites that open offline), a stand-alone lab that needs no course code. **Checkpoint 3 (Session 21, 30
  minutes):** Modules 7 and 8 so far (an accessible row against handed-out tests, the tests for a swipe rule).
  Same format.
- **Part 1 project (kickoff in Session 8, check-in in Session 9) and Part 1 assessment (Session 9):** **Fix-It
  Tables** for the Alder Row Repair Café, a repair queue from local typed data (types and Record tables, a ticket
  card with touch and accessible state, a themed FlatList with search, switches and a grouped SectionList; no API);
  the assessment is a written part (closed book, 15 minutes, 10 points) and a practical
  (`labs/module-09/part1-practical/`, open book, 30 minutes, 10 points). **Part 1 met** = the project complete
  under its six-row rubric (0 to 2 per row, 12 points) with no row at 0, and 14 or more of 20 points (70 %) on the
  assessment. Rubric, scoring and model-solution notes in `final-assessment.html`; the model solution in
  `labs/projects/part1-alder-row-repair-cafe/`, proved by `check_labs.py` (Jest, tsc, `expo lint`, `expo export`)
  and by the course's stage checker (exports for web, Android and iOS, browser checks with axe). When Part 1 runs
  alone, this is the course result.
- **Part 2 project (kickoff in Session 16, check-in in Session 17) and Part 2 assessment (Session 17):** **Bookmobile
  Stops** for the Tamarack County Library Bookmobile, on the project's own small mock API (`bookmobile-api`): four
  tabs and a stop's own screen, a simple sign-in with a protected tab, an offline-safe hold queue and a saved "My
  stop", a React Hook Form + Zod form and one device feature that runs in the web preview (Find my nearest stop with
  expo-location); a written assessment on Lessons 4.1 to 6.5 (closed book, 45 minutes, 20 points). **Part 2 met** =
  the project complete with no rubric row at 0 (six rows, 12 points), and 14 or more of 20 (70 %). Same materials,
  in `final-assessment.html` and `labs/projects/part2-tamarack-bookmobile/`.
- **Final project (Sessions 25 and 26):** Lesson 10.1's final-project kit (`downloads/final-project-kit/` on the
  course site: worksheet, seven client briefs, the rubric of 10 rows scored 0 to 2, the peer-review checklist and
  the starter) is the source; the kit adds facilitation, milestones, the evidence check, the showcase run-sheet and
  the written final assessment (24 items, 27 points, closed book, 35 minutes), and never a second rubric that
  disagrees with the lesson's. **Course complete** = the final project complete under Lesson 10.1's rubric (no row
  at "not yet") **and** the written final passed with at least 19 of 27 points (70 %). Nothing in the rubric needs
  money: its launch row takes any free route (an EAS internal preview build with a free Expo account, a recording
  of the app on a real phone in Expo Go or a development build, or, for an app without device features, a recording
  of the web preview). Its CI row asks for a green run on GitHub, so learners need a free GitHub account by
  Milestone 1.

## Requirements

- **Each learner:** a Windows 10/11, macOS or Linux laptop with permission to install software and several
  gigabytes free; **Node.js 24 LTS** with npm (checked on 24.22.2 with npm 11.19.1; the API needs 22.18 or newer);
  **VS Code** with the **Expo Tools** extension (the project recommends it; the ESLint extension is optional);
  a current Chrome or Edge (the lessons use its DevTools for the web preview at phone size); **Git** (recommended
  from Session 1, needed in Session 24 and for the final project); **Expo Go** on an iPhone or Android phone on the
  same Wi-Fi as the laptop (recommended, not required: the web preview covers every session and lab; the Android
  emulator and the iOS Simulator are optional). Accounts: a free **GitHub** account for Session 24's CI push and the
  final project; a free **Expo** account is optional (Sessions 23 and 24's cloud builds and updates); **no store
  account and no paid developer account** for anything.
- **Internet** for npm installs (the setup prework, then `npx expo install` in Sessions 5, 8, 11 to 16, 19, 20 and
  22 to 24), the labs' one shared install, Expo Snack (Session 1), the web Lottie player's engine (Session 19),
  GitHub (Session 24), EAS (optional) and the course site's downloads. The setup guide lists the hosts to allow
  through a school or company filter, and the network a phone needs to reach the laptop.
- **The instructor:** the same workspace on the demo machine, plus a projector at 1280×720 or more; your own phone
  with Expo Go (and screen mirroring) is a bonus, never required.
- **For the facilitator's lab check (`check_labs.py`):** Python 3.10 or newer (standard library only) on macOS,
  Linux or Windows with WSL (it uses POSIX file locks), and Node.js 24 (`RN_NODE=/path/to/node/bin` if it is not
  the course tools' path). With the author's course tools present, every command runs in a pseudo-terminal (what a
  learner's terminal shows); without them, through a plain pipe (same verdicts).

## Checking the labs (`labs/check_labs.py`)

```bash
cd instructor-kit
python3 labs/check_labs.py module-03                 # every lab of Session 3
python3 labs/check_labs.py module-03 -v              # also print each run's output
python3 labs/check_labs.py module-01/l1_2-your-toolchain        # one lab folder
python3 labs/check_labs.py projects/part1-alder-row-repair-cafe # one part project
python3 labs/check_labs.py --all                     # every session and the part projects
python3 labs/check_labs.py module-01 --no-api        # skip the runs that need shoreline-api
python3 labs/check_labs.py module-01 --api http://localhost:4000   # use YOUR running API instead
```

Every run works in a fresh copy of the lab folder (removed afterwards), laid out the way a learner has it
(`labs/module-NN/<lab>/`); the shared `labs/package-lock.json` is installed once into a cache (`npm ci`, about 20 s
from a warm npm cache) and hard-linked into each copy as `labs/node_modules`, so `node_modules` is never committed
or installed twice. A run declares its command, the exit code it expects and texts its output must or must not
contain; starters must fail where they should, solutions must pass, and every solution with a `tsconfig.json` must
also pass its type check (Jest and Node strip types without checking them). The few runs that need the API start a
**private** copy of `shoreline-api` on its own port (44NN for Session NN, never the learners' 4000) with a fixed
sample date, so the outputs are the same every day; anything that starts Metro uses 45NN, never 8081. Runs that need
a learner's course folder copy a course download (`"course": "lesson-11-start"`) with its packages installed; they
are skipped when the downloads are not on the machine. Session 1's full check is 20 runs in about two minutes.
**Buyer mode:** without the author's course tools, the checker starts `shoreline-api` from
`shoreline/shoreline-api` next to `labs/` (or `--api-dir PATH`), or uses `--api URL`.

## Editing and building

```bash
cd instructor-kit
python3 build-combined.py                 # regenerate the 3 books from source/ (with Part dividers)
python3 labs/check_labs.py --all          # run every lab
```

The author's tools in `~/projects/_kit_tools/reactnative/` (not shipped with a licensed kit):

```bash
python3 check_kit_rn.py 01 … 26           # per session (or --all): agenda sums to 180 with contiguous clocks
                                          # and one Break, checkpoint rows, lesson titles match
                                          # course-config.json, quiz identical across workbook/key/guide,
                                          # lesson-quiz letters match the pages, lab folders and lab.json rules,
                                          # code on slides and in docs equals the stage files, screenshots
                                          # exist, decks fit 1280x720, nothing wider than 390 px, no console errors
python3 assemble_final_rn.py              # final-assessment.html from _parts/ (the three fragments) + the
                                          # pass-mark table; --check exits 1 if it is stale
python3 gen_syllabus_rn.py                # rebuild ../syllabus.html and ../syllabus-print.html
                                          # (session titles checked against build-combined.py MODULES;
                                          # outlines and homework read from the facilitator guides)
python3 render_pdfs_rn.py                 # the seven kit PDFs + ReactNative-Syllabus-26-sessions.pdf,
                                          # page counts, and a 390 px check of every page
python3 rnkit.py -h                       # the course tools: per-lesson code stages, stage checks,
                                          # learner-accurate terminal output, the API and the downloads
```

**The generators are the source of truth.** Each session's three documents and deck are generated: the generator
for Session N is `~/projects/_kit_tools/reactnative/kit_generators/SNN/gen_SNN.py`, with the blocks it runs in
`blocks_SNN.py` (demo code is read from the lesson pages and the stage files themselves) and the lab files from
`labs_SNN.py` (deterministic: run twice, same files). Everything shown is run for real through `kitlib_rn.py`:
shell, Node and TypeScript blocks in a scratch copy of the stage's app (its lockfile installed, Expo's generated
types written by a short `npx expo start`, as a learner's first start does), requests against a private
`shoreline-api` with a fixed sample date, results cached next to the generator (`--fresh` reruns everything). Lab
outputs in the answer keys come from running the labs exactly as `check_labs.py` does. What no tool here can run
(Expo Go, a device, an account, a cloud build, a store) is quoted from the lessons' own output cards and hedged as
the lessons hedge it. The part projects and the final project come from `kit_generators/P1/`, `P2/` and `FINAL/`,
which write the fragments in `_parts/` that `final-assessment.html` is assembled from by `assemble_final_rn.py`
(rerun it after any of the three; it adds the kit shell and the pass-mark summary and stops if a fragment no longer
states a pass mark the summary states). Tool output quoted in the kit (tsc, `expo lint`, Jest, the Expo CLI) is
captured in a pseudo-terminal without AI-agent environment variables, so it reads exactly as on a learner's screen.
To change a session, edit its generator, run it from its own folder, check it (`check_kit_rn.py NN`,
`labs/check_labs.py module-NN`), then rebuild the books, the syllabus and the PDFs; hand edits to generated HTML
and lab files (session lab READMEs included) are lost the next time the generator runs. The kit-wide documents
(this file, `LICENSE.md`, `labs/README.md`, the setup guide, the quick setup, the sell sheet) are edited directly.

Or open any document and use **Print / Save as PDF** (Letter, 0.5 in margins, background graphics on).

---

## License

See `LICENSE.md`. Short version: licensed to a **single instructor or organization** to teach the kit; **not**
for resale; the facilitator guide, answer key and final assessment are **not** for learner distribution. The
Shoreline Crew materials, the part-project clients and the kit's labs are part of the licensed materials. Tiers
(Solo / Organization / White-label, for the full program, two consecutive parts or one part, plus an optional
updates add-on) are set at point of sale. Node.js, npm and the npm packages the lessons install (Expo and its SDK
modules, React Native, React, Expo Router, TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Reanimated,
Jest, React Native Testing Library, MSW and others, mostly MIT) and the Expo Go app are not part of the kit:
learners get them from their publishers under their own licenses (`LICENSE.md`, Third-party).

© 2026 Ray de la Paz. React Native & Expo: Build and Ship a Mobile App. All rights reserved.
