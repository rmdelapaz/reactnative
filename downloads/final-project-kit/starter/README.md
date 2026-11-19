# Final project starter

React Native & Expo: Build and Ship a Mobile App, Lesson 10.1 (Final Project).

An Expo SDK 58 app made the way Lesson 1.2 made Shoreline Crew (`npx create-expo-app@latest`, then
`npm run reset-project` answering **n**), with the course's conventions already in place and none of
Shoreline Crew in it: one example kind of thing (an `Item`), a mock API that answers for it inside the
app, and every check from the course wired up. Nothing here is specific to your brief yet. That is your
job, starting with the types.

## Start

Node.js 24 or newer. Copy this folder to where you keep projects (NOT inside `shoreline/`, which may be
a Git repository already), rename it, and in the new folder:

    npm ci
    cp .env.example .env.local
    npx expo start

(In PowerShell: `Copy-Item .env.example .env.local`.) Scan the QR code with Expo Go, or press `w` for
the web preview. `.env.local` says `EXPO_PUBLIC_API_URL=demo`: the app answers itself from
`src/mock-api`, so it works on any phone and any network, with no server to start. The list, an item's
screen, the New item form and "Page not found" all work.

## What is already set up

| Piece | Where | From |
|---|---|---|
| Template cleaned: `src/app` routes only, everything else in `src/`, `@/` imports | `src/` | Lessons 1.2, 1.3 |
| Theme: color roles by job, light and dark, `useTheme()` + `createThemedStyles()` | `src/theme/`, `src/hooks/useTheme.ts` | Lessons 2.1, 2.5 |
| `Screen` (safe areas, padding, `useScreenScroll`), `AppText` (variants, large text), `Button` (48 pt) | `src/components/` | Lessons 2.1-2.4, 8.1 |
| `LoadingView`, `ErrorView` (Try again), `EmptyState`, `ItemRow` (a whole-card link) | `src/components/` | Lessons 3.1, 4.1 |
| Expo Router: a stack, a modal, an `[id]` screen, not-found, a root `ErrorBoundary` | `src/app/` | Lessons 4.1, 4.2, 4.4, 9.3 |
| Where the data comes from (`demo` or a server address), shown on the first screen | `src/api/source.ts`, `src/components/SourceNote.tsx` | Lesson 5.1 |
| An API client that checks every answer, `ApiError`, `NetworkError`, `describeError` | `src/api/client.ts` | Lessons 1.3, 5.1 |
| TanStack Query: the client, query and mutation factories; AppState focus and NetInfo online | `src/api/queries.ts`, `src/api/mutations.ts`, `src/hooks/` | Lesson 5.2 |
| A React Hook Form + Zod form on a `FormScreen`, with the server's rule under its field | `src/app/new-item.tsx`, `src/api/schemas.ts` | Lesson 5.4 |
| The mock API: routes and rules per resource, sample data | `src/mock-api/` | this lesson |
| Jest + jest-expo + React Native Testing Library + MSW (Node's fetch back, phone-sized window) | `jest.environment.js`, `jest.setup.ts`, `src/test/` | Lessons 8.2, 8.3 |
| Tests: the mock API's rules, the client, three screens, the config: 22 tests | `**/*.test.ts(x)` | Lessons 8.2, 8.3, 9.2 |
| Zod's message languages left out of the bundle | `metro.config.js` | Lesson 8.4 |
| `app.config.ts` with development, preview and production variants; production refuses demo and http | `app.config.ts` | Lessons 9.1, 9.4 |
| `eas.json`: preview (internal, on the mock API) and production profiles, submit to internal testing | `eas.json` | Lessons 9.2, 9.4 |
| A crash screen and a `reportError` seam for a crash-reporting service | `src/components/CrashScreen.tsx`, `src/monitoring/` | Lesson 9.3 |
| GitHub Actions: types, lint and tests on every push | `.github/workflows/ci.yml` | Lesson 9.3 |

Left out on purpose (add them when your brief needs them, from your Shoreline Crew): tabs (4.2),
sign-in and `Stack.Protected` (4.3), SecureStore, AsyncStorage settings, SQLite (5.3), the offline
queue (5.5), permissions (6.1), camera, location, maps, notifications, haptics, sharing (6.2-6.5),
Reanimated, gestures, Lottie (Module 7), `expo-dev-client` (9.2), `expo-updates` (9.3).
Install each with `npx expo install`, and add its plugin to `app.config.ts` by hand: `npx expo install`
cannot write into a dynamic config ("Cannot automatically write to dynamic config").

## Commands

| Command | What it does |
|---|---|
| `npx expo start` | Metro: the QR code for Expo Go, `w` for the web preview (restart with `--clear` after changing `.env.local`) |
| `npx tsc --noEmit` | Type check (after `npx expo start` has run once, or `npx expo customize tsconfig.json`) |
| `npx expo lint` | ESLint with Expo's rules (clean = no output) |
| `npm test` | Jest in watch mode; `npm test -- --watchAll=false` runs once |
| `npx expo export --platform android` | Proves the JavaScript bundles for Android (also `ios`, `web`) |

## Make it yours (Milestone 1)

1. Name it: `slug`, `scheme` and the three `variants` (names and ids on a domain you control) in
   `app.config.ts`, `"name"` in `package.json`, and the expected names and ids in `app.config.test.ts`.
   Your own icon and splash: Lesson 2.3. Your colors: `src/theme/colors.ts`.
2. Types first: add your brief's types to `src/api/types.ts`, NEXT to the example `Item` (the example
   screens keep working, so every check stays green). Give each union a label table (`src/utils/labels.ts`).
3. Sample data: 6 to 12 records per type in `src/mock-api/db.ts`, one of them awkward on purpose.
4. Your API's rules: one file per resource in `src/mock-api/` (like `items.ts`), one line in the
   `resources` table of `handle.ts`, and a test file next to it with a test for every rule.
5. Keep `npx tsc --noEmit`, `npx expo lint` and `npm test -- --watchAll=false` green after every step,
   and commit.

Milestone 2 replaces the Item screens with yours and deletes `Item` from `types.ts`: `npx tsc --noEmit`
then lists every file that still expects it.

## Make it a repository with CI

This folder is the whole repository: `package.json` sits next to `.github`.

    git init -b main
    git add .
    git status
    git commit -m "Start from the final-project starter"

`git status` must not list `.env.local`, `node_modules` or `dist`. Create an empty repository on
GitHub, push, and watch the Actions tab.

## Data: demo, your own server, or only the phone

- **demo** (the default): the mock API in `src/mock-api` answers inside the app, with a short delay.
  Data lives in memory: it starts again when the app restarts, as the note on the first screen says.
  A preview build made with `eas.json`'s preview profile uses it too, so testers need no server.
- **A server**: set `EXPO_PUBLIC_API_URL` to its address (see `.env.example` for each device). The
  client, the checks and the error messages stay the same. A production build accepts only `https://`.
  Never put a secret in an `EXPO_PUBLIC_` variable: it is copied into the app for anyone to read.
- **Only the phone** (no server at all): keep the data in SQLite or AsyncStorage (Lesson 5.3), keep
  `src/mock-api` for the tests if it still helps, and change the production check in `app.config.ts`
  to what your app really needs.

## Checked for the course

Node.js 24.22.2, npm 11.19.1, Expo SDK 58 (expo 58.0.25, React Native 0.88.1): in a fresh copy with
`npm ci`, the course's check ran `npx tsc --noEmit`, `npx expo lint` (0 problems), `npm test` (6 files,
22 tests), `npx expo export` for web, Android and iOS, and 8 checks of the web preview at phone size
(the screens, a new item, the server rule under the field, dark mode, axe accessibility checks).
Nothing was run on a phone, built with EAS or pushed to GitHub for this check.
