# Lab 9.2: build profiles, checked before you spend a build

A cloud build takes minutes and counts against your month; a check on your own computer takes a second. Lesson
9.2's `app.config.test.ts` checks Shoreline Crew's three profiles. This lab builds the same kind of safety net,
as reusable code, for another app: **Rockpool Survey**, a made-up app volunteers use to count what lives in tide
pools. Its `appConfig.ts` (given, do not edit) is the label: `appFor(env)` turns `APP_VARIANT` and
`EXPO_PUBLIC_API_URL` into the app's name and id, and refuses what Lesson 9.1's guards refuse. Its `eas.json` is
the packing list, with four build profiles and two mistakes.

**Setup:** a terminal in `labs/module-23/l9_2-development-builds-and-eas-build/starter` (the shared lab install:
nothing to install). Run `npm test`: every test fails with a `TODO` message. `npm run check` is the type check.

## Task 1: follow "extends" (profiles.ts)

`development-simulator` in `eas.json` starts from `development` with `"extends"` and adds one iOS setting (the
lesson's Exercise 2). EAS merges the two; your code must too. Write `resolveProfile(eas, name)`: the profile with
everything it inherits (the child's keys win; `env`, `ios` and `android` are merged key by key), without the
`extends` key. An unknown name throws `No build profile named "<name>" in eas.json`; profiles that extend each
other in a circle throw `Build profiles extend each other in a loop: a -> b -> a`. Done when the three Task 1
tests pass.

## Task 2: a profile checker, then fix eas.json (checkProfiles.ts, eas.json)

Write `checkProfiles(eas)`. For every build profile (resolved with Task 1), it reports a **problem** when:

1. the profile's `env` sets no `APP_VARIANT` (the build would quietly be the development app);
2. `appFor(env)` throws (pass on its message, after the profile's name and a colon);
3. the build installs from a link with its JavaScript inside (`distribution` is `"internal"`, not a development
   client, not an iOS Simulator build) and its `env` has no `http://` or `https://` `EXPO_PUBLIC_API_URL`:
   `.env.local` never reaches a cloud build.

One refusal is not a problem but a **note**: the production guard (`A production build needs an https://...`),
because Rockpool Survey has no https server yet, exactly like Shoreline Crew. Then run the checker on the lab's
own `eas.json`:

```bash
node check-eas.ts
```

It names two problems. Fix `eas.json` (the preview build's address is `http://192.168.1.42:4000`, the course's
example) until it prints `No problems:` and exits 0. Done when the four Task 2 tests pass.

## Task 3: new build, or just Metro? (rebuild.ts)

Write `needsNewBuild(change)`: `'metro'` when saving a file (and maybe restarting Metro) is enough for the
installed development build, `'new build'` when something is compiled into the app. A `Change` is code Metro
bundles, a package (with or without native code), a native field of the app config, or an environment variable
for the development or the preview build. Use a `switch` on `change.kind` with an exhaustive `never` check at the
end, so `npm run check` names any kind you forgot. Done when `npm test` ends with `ℹ fail 0` and `npm run check`
prints nothing after its two `>` lines.

**Stretch:** add a `{ kind: 'sdk'; from: number; to: number }` change (a new Expo SDK) to the union and watch
`npm run check` point at your switch before any test runs.
