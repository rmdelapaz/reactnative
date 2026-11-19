# Lab 9.1: App Config and Environments (a second app: Shoreline Lookout)

Shoreline Lookout is a small second app for crew leaders (beach conditions near a cleanup). Its `app.config.ts` is
one fixed set of values, with three problems Lesson 9.1 taught you to see. You give it three variants, a guard and
a key from the environment. The tests in `src/config.test.ts` load the config the way Expo does, once per variant
(do not edit them). There is no `app.json`: `app.config.ts` is the only config. Nothing to install (the shared lab
install), no phone, no account. Work in `starter/`.

| Variant | Name | App id (both platforms) | Link scheme |
|---|---|---|---|
| development (the default) | Lookout Dev | `com.example.shorelinelookout.dev` | `shorelinelookout-dev` |
| preview | Lookout Preview | `com.example.shorelinelookout.preview` | `shorelinelookout` |
| production | Shoreline Lookout | `com.example.shorelinelookout` | `shorelinelookout` |

## Task 1: three variants, and the key tsc names (20 min)

1. `npm test`: six tests fail. Then `npm run typecheck`: one key is misspelled. In an `app.json`, Expo would
   ignore it without a word; in TypeScript it is a type error. Fix it.
2. Add a `variants` object, a type guard, and `APP_VARIANT ?? 'development'`. An unknown name throws:
   `APP_VARIANT must be development, preview or production, not "Preview".` (names are case-sensitive).
3. See what Expo sees: `npx expo config --type public`, then `APP_VARIANT=preview npx expo config --type public`
   (PowerShell: `$env:APP_VARIANT = "preview"`, the command, then `Remove-Item Env:APP_VARIANT`).

Done when: the three `Task 1` tests pass and `npm run typecheck` prints nothing after its two `>` lines.

## Task 2: no plain http in production, and a scheme per variant (10 min)

1. Production throws `A production build needs an https:// EXPO_PUBLIC_API_URL, not "…".` unless the address
   starts with `https://`. Try it: `APP_VARIANT=production EXPO_PUBLIC_API_URL=http://lookout-api.example.org npx expo config --type public`.
2. The development variant gets the scheme `shorelinelookout-dev` (Lesson 9.1's Common Questions: with two
   variants on one phone, a link should open the right one); the others keep `shorelinelookout`.

## Task 3: the Maps key comes from the environment (5 min)

Someone pasted a key into the file. Read it from `process.env.ANDROID_GOOGLE_MAPS_API_KEY` instead (no
`EXPO_PUBLIC_` prefix: the config reads it on your computer; your JavaScript never needs it). In a real project the
key goes in `.env.local`, never in a committed file.

Done when: `npm test` says `Tests:       6 passed, 6 total`, `npm run typecheck` and `npm run lint` print nothing
after their two `>` lines, and `APP_VARIANT=preview npx expo config --type introspect` shows `Lookout Preview` and
your location sentence (search the output for `CFBundleDisplayName` and `NSLocationWhenInUseUsageDescription`).

## Questions for the debrief

- Why is development the default variant, and not production?
- The Maps key is no longer in the file. Is it a secret now? (Lesson 9.1: plugin options are in the public config,
  so every build carries it: restrict the key in Google Cloud.)
- What would `npx expo config` do with the starter's misspelled key? What does `npm run typecheck` do?
