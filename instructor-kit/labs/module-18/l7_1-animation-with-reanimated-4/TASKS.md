# Lab 7.1: a bar that glides, a dot that steps aside, a count that lands

New practice for Lesson 7.1 (not the tally project): three small components for the supply table at a Shoreline
Crew cleanup. Work in `starter/`; the shared lab install has everything (`npm install` once in `shoreline/labs`).

Run in `starter/`: `npm test` (the tests say what each component must do), `npm run typecheck`, `npm run lint`.
Reanimated's Jest stand-in has no UI thread: the tests check which style or animation your code asks for. To SEE it,
`npm run web` (optional; Ctrl+C stops it).

## Task 1: SuppliesBar glides (src/SuppliesBar.tsx)

`filledPercent(given, stock)` must stay between 0 and 100 and never divide by 0 (TODO 1a). Then make the fill glide
to its new width with a CSS-style transition: `transitionProperty`, `transitionDuration` (400) and
`transitionTimingFunction` ('ease-out') in its style. Which component accepts a style like that: `View` or
`Animated.View`? (TODO 1b)

## Task 2: LiveBadge steps aside (src/LiveBadge.tsx)

The dot pulses with a CSS-style keyframe animation. Lesson 7.1 measured that these do NOT follow Reduce Motion by
themselves: use `useReducedMotion()` and leave the pulsing style out when it is on (TODO 2a). The dot is decoration:
hide it from screen readers on both platforms (TODO 2b: two props).

## Task 3: BagCounter lands (src/BagCounter.tsx)

`npm run lint` reports one error in this file: read the rule's name and fix it the way Lesson 7.1 does. Then the
count: it uses Reanimated 3's old default spring. Sketch on paper what a volunteer sees when the count goes from 0
to 7 with a spring that overshoots, then count with `withTiming` (900 ms, `Easing.out(Easing.cubic)`).

Done when `npm test` says `Tests:       8 passed, 8 total`, and `npm run typecheck` and `npm run lint` print nothing
after their two `>` lines.
