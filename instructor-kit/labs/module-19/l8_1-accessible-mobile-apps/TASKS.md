# Lab 8.1: Accessible Mobile Apps, on new material

Practice for Lesson 8.1 on three findings from an audit of a "beach day" screen, not the course app. Work in
`starter/` (a terminal in this folder's `starter`; nothing to install: the shared lab install in `shoreline/labs`).

```bash
npm test             # Jest, once (every test fails as shipped)
npm run typecheck    # tsc --noEmit
npm run lint         # npx expo lint
```

React Native Testing Library finds elements the way a screen reader meets them, by role and name, and skips what
is hidden from screen readers. A passing test is not a screen reader on a phone (Lesson 8.1: automated checks find
only part of the problems): it locks in a fix you already checked by ear.

## Task 1: one row, one target, one stop (`src/PackingItem.tsx`)

As shipped, a screen reader meets the words and then a box called "button" (two stops, and neither says both
things), and only the 24-point box answers a finger. Make the whole row one `Pressable` with the checkbox role,
`aria-checked` for its state, its words as its `accessibilityLabel` and at least 48 points of height, and the ☐/☑ picture
is hidden (the state is already said). Unlike Lesson 8.1's switch row, there is no native Switch inside, so the
row itself can be the control.

## Task 2: heard on iPhone too (`src/SyncStatus.tsx`)

`accessibilityLiveRegion` works for TalkBack and the web preview, not for VoiceOver. On iPhone, ask VoiceOver to
say each new message with `AccessibilityInfo.announceForAccessibilityWithOptions(message, { queue: true })`, when
the message first appears and whenever it changes, never for an empty one. (Jest runs as an iPhone here:
`Platform.OS` is `'ios'`.)

## Task 3: large text, not less text (`src/TideTiles.tsx`)

Someone made the tide times fit at the largest text size with `allowFontScaling={false}`: unreadable for exactly
the person who turned the size up. Remove it everywhere; at a `fontScale` of 1.5 or more (`useWindowDimensions()`),
stack the tiles (`flexDirection: 'column'`); cap only the already-big times with `maxFontSizeMultiplier={1.75}`.

**Done when** `npm test` says `Tests:       6 passed, 6 total`, and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines.

**Stretch.** Write the radio call (label, role, state) a screen reader would make for each element of `App.tsx`,
then check one on your phone in the web preview's Accessibility pane (`npm run web`, Chrome DevTools > Elements >
Accessibility).
