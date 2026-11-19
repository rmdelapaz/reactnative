# Peer Review Checklist

React Native & Expo: Build and Ship a Mobile App, Lesson 10.1. You review a classmate's (or a
friend's) final project; they review yours. Plan about 90 minutes for one review. You need: read
access to their repository, their `worksheet.md`, the brief they built, and their launch: a preview
build link, or their recorded demo. You never need their passwords, store accounts, Expo account or
`.env.local`: if you do, that is a finding.

Project:                          Brief:
Author:                           Reviewer:
Launch you used (preview build on which phone / recording / Expo Go from their repository):

## 1. Read the plan first (15 min)

- [ ] The charter says who the app is for, what must work, and what is out of scope (with a reason)
- [ ] The domain types fit the brief: statuses are unions with label tables, computed values are not stored
- [ ] The storage table says where each piece of data lives and what happens on a restart and a sign-out
- [ ] The offline plan is written down: what works without a connection and what the person sees
- [ ] Each permission has a moment, a reason and a plan for "no"
- [ ] The data inventory and the release checklist are filled in, honestly ("not possible yet" is fine)

## 2. Run it on a phone (20 min)

- [ ] Install their preview build (or open their project in Expo Go: `npm ci`, `.env.local` from
  `.env.example`, `npx expo start`), or watch their recording from start to end
- [ ] The first screen says which data it shows (demo data, or which server)
- [ ] Each must-have from their charter works (write down any that don't, with steps to reproduce)
- [ ] Airplane mode on, then off: does the app do what the offline plan says? Nothing sent twice?
- [ ] Answer "Don't allow" to each permission: is there still a way forward?
- [ ] Close the app completely and open it again: is what should be kept still there?
- [ ] A link from their worksheet (`their-scheme://…`) opens the right screen (`npx uri-scheme open`
  on an emulator, or a message to yourself on a phone)

## 3. Accessibility (15 min)

- [ ] VoiceOver (iPhone) or TalkBack (Android) on: every control on the main journey is named and
  says what it does; nothing is read twice; decoration is skipped
- [ ] The largest text size: nothing cut off, nothing overlapping, every button still reachable
- [ ] Reduce Motion on: animations step or fade instead of moving
- [ ] Dark mode: every screen readable

## 4. Read and run the code (25 min)

- [ ] The latest commit has a green tick in GitHub Actions; open the run and read one job's steps
- [ ] No `.env.local`, `node_modules`, `dist`, keystores, `.p8` or service-account files in the repository;
  `.env.example` lists every variable, with no secret in it (an `EXPO_PUBLIC_` value is never a secret)
- [ ] Clone it and run `npm ci`, `npx expo customize tsconfig.json`, `npx tsc --noEmit`, `npx expo lint`
  and `npm test -- --watchAll=false`: all green on your computer too
- [ ] `app.config.ts` has their own names and ids, and refuses a production build it could not ship
- [ ] `src/api/types.ts` reads like the brief; search the code for `any` and ` as ` and ask about each one
- [ ] API answers (and anything read from storage) are checked before use
- [ ] The tests cover the rule from the worksheet that "must not happen"

## 5. Write the feedback (15 min)

Kind, specific, useful. For each point: what you saw, where (screen and steps, or file and line), on
which phone, and how to reproduce it.

- Two things that work well, and why:
  1.
  2.
- Two things to improve, most important first:
  1.
  2.
- One question you would ask as their client:

Then score the project with `rubric.md` and send both to the author. Author: answer every point,
either with a fix (and the commit) or with a sentence on why you are leaving it.
