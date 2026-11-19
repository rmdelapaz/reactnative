# Lab 2.5: beach tiles by day, by night and at any width

A small screen of beach tiles with its own day and night palettes (new material, not the lesson's project). It
practices Lesson 2.5's three ideas: a theme TypeScript keeps complete, styles made once per theme, and a layout that
follows the window. Each task has one mistake from the lesson's Common Mistakes.

Setup: nothing to install (the shared lab install, `npm install` once in `shoreline/labs`). Open a terminal in
`starter/` and run `npm test`, then `npm run typecheck`. The tests switch the phone to dark mode
(`jest.spyOn(ReactNative, 'useColorScheme')`) and resize the window (`Dimensions.set`): no phone needed.
`src/theme/theme.ts` (useTheme, createThemedStyles) and `src/theme/contrast.ts` are ready to use: read them first.

## Task 1: a complete night palette (src/theme/palettes.ts)

`npm run typecheck` reports a role the dark set forgot, through `satisfies ThemeColors` (TS1360, "Property ... is
missing"): read where it points. The night accent is a light teal, so the text on it is dark: use the night page
color. Then `npm test`: one night color reads below 4.5:1 on the night surface. Pick a lighter one (Shoreline
Crew's night muted is `#a9b4c0`). Done when the Task 1 test passes and the type check is clean.

## Task 2: a tile that follows the night (src/SiteTile.tsx)

`StyleSheet.create` at the bottom of the file ran once, when the file loaded, with the daytime colors. Wrap it in
`createThemedStyles(({ colors }) => StyleSheet.create({ ... }))`, keep it outside the component, and call the
`useStyles()` it returns first thing inside. (Calling `useTheme()` at the top of the file instead is the lesson's
other mistake: `npm run lint` would say "React Hook "useTheme" cannot be called at the top level".) Done when both
Task 2 tests pass.

## Task 3: columns that follow the window (src/useColumns.ts)

`Dimensions.get('window')` at the top of the file read the width once (under Jest, before the test set a phone's
390). Use `useWindowDimensions()` inside the hook. Done when both Task 3 tests pass.

## Done when

`npm test` says `Tests:       5 passed, 5 total`, and `npm run typecheck` and `npm run lint` print nothing after
their two `>` lines.
