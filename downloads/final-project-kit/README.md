# Final Project Kit

React Native & Expo: Build and Ship a Mobile App, Lesson 10.1 (Final Project).

| File | What it is |
|---|---|
| `worksheet.md` | The planning worksheet: charter, phones, types, look and feel, screens, lists, forms, data and the mock API, storage and offline, device features, motion, accessibility, tests, config, privacy and the release checklist, the launch plan, milestones and a time log. Copy it into your project and fill it in. |
| `briefs.md` | The seven client briefs from the lesson (each says which device features are in scope and how the data is served), plus the size rules for your own idea. |
| `rubric.md` | How the project is assessed: ten rows, mapped to the course's modules, 0/1/2 each. Self, peer and instructor use the same rubric. Nothing in it needs a paid account. |
| `peer-review.md` | The checklist a reviewer follows on your phone build or recording and on your repository. |
| `starter/` | An Expo SDK 58 app to start from: the template cleaned as in Lesson 1.2, with the course's conventions set up and none of Shoreline Crew. Its own `README.md` explains it. |

## The starter in one minute

Copy the `starter` folder to where you keep projects (not inside your `shoreline` folder) and rename
it (for example `copperline-couriers`). Then, with Node.js 24 or newer:

    npm ci
    cp .env.example .env.local
    npx expo start

(In PowerShell: `Copy-Item .env.example .env.local`.) It runs on its own mock API inside the app
(`EXPO_PUBLIC_API_URL=demo`), so Expo Go on any phone works with no server and no shared Wi-Fi. One
example kind of thing (an `Item`) shows every pattern: a list with all its states, an item's screen, a
form with the server's rule under its field, not-found and a crash screen. Theme, `Screen`, `AppText`,
TanStack Query, React Hook Form + Zod, Jest with React Native Testing Library and MSW, `app.config.ts`
variants, `eas.json` and a GitHub Actions workflow are already set up. The folder is meant to be its
own Git repository: `.github/workflows/ci.yml` sits at its top.

Milestone 1 (in the lesson) gives it your names and ids, adds your types next to the example, your
sample data and your mock API's rules with tests. Milestone 2 replaces the example screens and
deletes `Item`.

## How long it takes

The lesson's printed time covers reading, choosing a brief, the first pass of the worksheet, setting
up the starter and Milestone 1. The whole project is about 30 more hours, usually 25 to 35, best
spread over four to six weeks. The worksheet's time log keeps the estimate honest.

## What it costs

Nothing. Every row of the rubric can be met with free tools: Expo Go, a free Expo account for an
internal preview build, a free GitHub account for CI, or a recording of the app on your phone. Store
accounts (Apple's yearly membership, Google Play's one-time fee) are never required; Lesson 9.4 says
what they cost if you decide to publish later.
