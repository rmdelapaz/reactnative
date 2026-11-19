# Instructor Kit License (Summary / Template)

**Kit:** React Native & Expo: Build and Ship a Mobile App, an instructor kit for the course of the same name
(<https://rays-reactnative.netlify.app/>)
**Author & licensor:** Ray de la Paz

> This is a plain-language template. Replace the bracketed terms at point of sale
> and have final wording reviewed by a lawyer before commercial distribution.

## Licensed materials
"The kit" means everything in the `instructor-kit/` folder and the course data it is taught with:

- the facilitator guides, participant workbooks and answer keys (per session and combined), the slide decks,
  the labs (task sheets, starters and solutions, fixtures, debug handouts, the shared lab `package.json` and
  lockfile, the environment check and the diagnostic, the Part 2 and Part 3 catch-up checks, the checkpoints, the
  Part 1 assessment's practical, the launch-readiness check, the final project's evidence check, the Part 1 and
  Part 2 projects with their model solutions and the Part 2 project's mock API, and the checker `check_labs.py`),
  the setup guide and quick setup, `final-assessment.html` (and the fragments in `_parts/` it is assembled from)
  and the sell sheet;
- the course's **practice data**: the fictional Shoreline Crew (its sites, cleanups, volunteers, organizers, sample
  accounts and email addresses, the site pictures and the app's log-sent animation), the fictional clients of the
  Part 1 and Part 2 projects and assessments (the Alder Row Repair Café, the Tamarack County Library Bookmobile), of
  the labs and of the final-project briefs, and the course downloads (`shoreline-api`, the `lesson-NN-start` and
  `lesson-NN-end` code and the final-project kit with its starter). These are original works, written and drawn by
  the author for the course.

The kit has three parts: **Part 1, Foundations and Lists** (Sessions 1 to 9), **Part 2, Navigation, Data and
Devices** (Sessions 10 to 17) and **Part 3, Motion, Quality and Shipping** (Sessions 18 to 26). A part license
covers that part's sessions and their materials (for Part 1 and Part 2, the matching sections of
`final-assessment.html`; for Part 3, the final project section); a two-part license covers two consecutive parts; a
full license covers all 26 sessions.

## Grant
You (the "Instructor") are granted a **non-exclusive, non-transferable license** to use the kit to **teach the
course to your own students**, according to the tier and scope you purchased:

| Tier | Who may teach | Rebranding |
|------|---------------|------------|
| **Solo** | One named instructor | No |
| **Organization** | Multiple instructors at one org | No |
| **White-label** | Multiple instructors at one org | Yes — edit & add your brand |

| Scope | Solo | Organization | White-label | Updates add-on |
|-------|------|--------------|-------------|----------------|
| **Full program** (26 sessions) | [$1,597] one-time | [$4,797] one-time | [$9,597] one-time | [$319 / yr] |
| **Two consecutive parts** (Parts 1–2 or 2–3) | [$1,097] one-time | [$3,297] one-time | [$6,597] one-time | [$219 / yr] |
| **Part 1 only** (Sessions 1–9) | [$647] one-time | [$1,947] one-time | [$3,897] one-time | [$129 / yr] |
| **Part 2 only** (Sessions 10–17) | [$597] one-time | [$1,797] one-time | [$3,597] one-time | [$119 / yr] |
| **Part 3 only** (Sessions 18–26) | [$647] one-time | [$1,947] one-time | [$3,897] one-time | [$129 / yr] |

A part or two-part license can be upgraded to a larger scope for the difference in price [at point of sale].

## You MAY
- Teach the course to an unlimited number of your own students under your tier and scope.
- Print and distribute the **participant workbook**, the **setup guide**, the **quick setup**, the lab **task
  sheets**, **starter** folders and **fixtures**, the shared lab install files, the environment check and the
  catch-up, launch-readiness and evidence checks to enrolled students.
- Point enrolled students to the free course site and its downloads.
- Hand out lab **solutions** to enrolled students after the lab has been completed in class.
- Adapt timing, examples, and pacing to your audience.
- (White-label only) Edit the materials and add your own branding.

## You MAY NOT
- Resell, sublicense, or redistribute the kit itself to other instructors.
- Distribute the **facilitator guide**, the **answer key** or the **final assessment** (the part-project and
  assessment rubrics, model solutions and scoring notes, the final-project scoring guidance, the written final
  assessment and its key, and instructor notes), or the checkpoint, part-project and assessment solution folders,
  to students. These are **confidential** instructor materials. (The final project's own rubric is part of Lesson
  10.1's public kit on the course site.)
- Publish the materials publicly (e.g., a public website, repository or file share), including republishing
  the practice data as your own.
- Remove author credit (except under the white-label tier).

## Third-party software, apps and data
**No third-party software is shipped with the kit.** Everything below is downloaded and installed by each
learner and the instructor, from its usual source, under its own license:

- **Node.js** (24 LTS; **MIT License**) with **npm** (**Artistic License 2.0**), installed by each learner from
  nodejs.org or a version manager.
- **npm packages** installed by the lessons and the labs' one shared install from the npm registry, under their
  own licenses: Expo and the Expo SDK modules (`expo`, `expo-router` and the `expo-*` packages), React Native,
  React and React DOM, React Native Web, React Native Reanimated and Worklets, React Native Gesture Handler,
  FlashList, react-native-maps, AsyncStorage, NetInfo, TanStack Query, Zustand, React Hook Form, Zod and
  `@hookform/resolvers`, `@lottiefiles/dotlottie-react`, Jest and jest-expo, React Native Testing Library, MSW,
  ESLint and `eslint-config-expo` (**MIT**); TypeScript and lottie-react-native (**Apache-2.0**); and their
  dependencies. Tools run with `npx` (create-expo-app, `expo-doctor`, EAS CLI) are downloaded the same way.
  Packages land in each learner's own `node_modules/` folders; the kit and the course downloads ship only the
  `package.json` and `package-lock.json` files that name them, never `node_modules`. `shoreline-api` itself has no
  dependencies.
- **Fonts:** Shoreline Crew uses **Outfit**, installed through the `@expo-google-fonts/outfit` package, licensed
  under the **SIL Open Font License 1.1**. The kit's own documents load Archivo, Source Sans 3 and JetBrains Mono
  from Google Fonts (**SIL Open Font License 1.1**); no font file is shipped with the kit.
- **Apps, services and stores** mentioned or used as tools (VS Code and its extensions including Expo Tools, Expo Go,
  Expo Snack, Expo's accounts, EAS Build and EAS Update, GitHub and GitHub Actions, Android Studio, Xcode, Maestro,
  the App Store and App Store Connect, Google Play and the Play Console) are not shipped with the kit and are used
  under their providers' own terms. The course needs only free tools: an Expo account is optional, a free GitHub
  account is used for continuous integration, and **no store account and no paid developer account** is needed
  for any step, for the final project or to pass. Lessons 9.2 to 9.4 teach learners to read those terms (fees,
  free-plan limits and store rules change; the lessons say to check the provider's page before paying for
  anything).

React and React Native are trademarks of Meta Platforms, Inc.; Expo is a trademark of 650 Industries, Inc.;
TypeScript and VS Code are trademarks of Microsoft Corporation; Apple, iPhone, iOS, Xcode and App Store are
trademarks of Apple Inc.; Android and Google Play are trademarks of Google LLC; Node.js is a trademark of the OpenJS
Foundation; GitHub is a trademark of its owner. The kit is not affiliated with or endorsed by any of them.

**All data in the kit is the author's own and fictional:** every organization, site, cleanup, volunteer, organizer,
account, client and email address in Shoreline Crew, the part projects and assessments, the labs and the
final-project briefs is invented (email addresses use `example.com`; web addresses in examples use `example.org`
and `example.com`, and app ids use `com.example`). The sample accounts' shared password (`shoreline-demo`) and the
API's development tokens are public practice values for the local mock API only.

## The public course site
The lessons at <https://rays-reactnative.netlify.app/>, the course downloads in its `downloads/` folder and the
public syllabus remain freely available to anyone. This license covers the instructor kit and its use for
teaching; it does not restrict anyone's use of the free lessons and downloads. Learners keep the code they write,
including final projects built on the course's starter.

## Ownership
All materials remain the intellectual property of the licensor. This license may be revoked for breach of these
terms.

---
© 2026 Ray de la Paz. All rights reserved.
