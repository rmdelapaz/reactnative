# Lab 7.3: Motion Polish, on new material

Practice for Lesson 7.3 on three small pieces of a "beach photos" screen, not the course app. Work in `starter/`
(a terminal in this folder's `starter`; nothing to install: the shared lab install in `shoreline/labs`).

```bash
npm test             # Jest, once (7 of the 9 tests fail as shipped)
npm run typecheck    # tsc --noEmit
npm run lint         # npx expo lint
npm run web          # optional: the screen in the web preview (Ctrl+C stops it)
```

Reanimated needs two lines of setup under Jest, both already here and both explained where they are: the
`resolver` in `package.json` (`"jest"`) and the `jest.mock(...)` at the top of `src/lab.test.tsx` (Lesson 8.2
explains test setup). The stand-in renders Animated views as plain views and keeps their props, so the tests check
which animation your code asks for; the web preview shows it move.

## Task 1: a switch that only adds (`src/motion.ts`)

`reduceMotionFrom(phoneReduces, appSwitch)` decides whether motion steps aside. As shipped, the app's "Calm photos"
switch overrules the phone: a volunteer whose phone asks for less motion turns the switch off and gets full
motion back. Make the switch only ADD (Lesson 7.3, An In-App Switch: The Decision). One line.

## Task 2: a still twin, hidden from screen readers (`src/SavedMark.tsx`)

The "photo saved" mark is a Lottie animation (the course's own log-sent drawing). Three things are wrong: it plays
forever, it plays even when motion should step aside, and screen readers meet it although the heading next to it
says "Photo saved" in words. Play it once; with `reduceMotion`, render `StillMark` instead (no animation at all);
hide the wrapping View with the one prop that works on iPhone, Android and in the web preview.

## Task 3: tags that make room (`src/TagList.tsx`)

As shipped, `layout={LinearTransition}` sits on the box around the tags, which only gets shorter, and the tags
themselves are plain Views. Make each tag an `Animated.View` that fades in, leaves to the left (`FadeOutLeft`)
and glides into place; take the transition off the box (Common Mistakes: "A layout transition on the box and on
what is in it"); and wrap the list so the tags that are there when it first appears do not fade in.

**Done when** `npm test` says `Tests:       9 passed, 9 total`, and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines. Then `npm run web`: remove a tag and watch the others glide up; turn on
Calm photos and the mark is still.

**Stretch.** Use `useReducedMotion()` from Reanimated in `App.tsx` instead of the hard-coded `false`, then read
Lesson 7.3's warning about it: why is it the wrong hook for a setting that changes while the app runs?
