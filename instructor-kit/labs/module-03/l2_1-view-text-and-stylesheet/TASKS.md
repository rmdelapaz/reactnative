# Lab 2.1: CSS habits on a phone

New practice on Lesson 2.1's ideas, on three small components that are not in the course app: styles are objects
(numbers without units, `lineHeight` is a size), a View passes no text styles on, a style array merges left to right
(later entries win), and a Text inside a Text is the one place where text styles are inherited. The tests in
`src/lab.test.tsx` check the styles each Text really gets (`toHaveStyle`), which is what a phone draws.

**Setup:** the shared lab install (`npm install` once in `shoreline/labs`; done in Session 1). A terminal in
`labs/module-03/l2_1-view-text-and-stylesheet/starter`, then `npm test` (eight tests fail) and
`npm run typecheck` (two errors).

## Task 1: the tide notice (src/TideNotice.tsx)

Shoreline Crew HQ showed this notice with a CSS Module:

```css
.notice { padding: 12px; border-radius: 12px; background: #bfe3df; color: #0b3954; font-size: 20px; }
.notice p { font-size: 16px; line-height: 1.5; color: #1f2a37; }
.notice small { font-size: 14px; color: #5b6573; }
```

The starter translated it line by line, and four habits came along. One is a type error (`npm run typecheck`
names it); three type-check and do nothing on a phone. For each failing Task 1 test, ask the lesson's two
questions: is this style on the right kind of component? Is this a value React Native understands? Done when the
four Task 1 tests pass. Give every text a `lineHeight` about one and a half times its `fontSize`.

## Task 2: the order of a style array (src/CrewText.tsx)

`CrewText` is this lab's text component, built like the course app's AppText. Two tests fail: a screen's own color
loses to the variant, and the warning variant has no look at all. `npm run typecheck` points at the second one
(TS7053, at `styles[variant]`): the type and the styles disagree. Fix both. Done when the three Task 2 tests pass
and `npm run typecheck` prints nothing after its two `>` lines.

## Task 3: part of a line (src/DebrisTally.tsx)

The tally should be ONE line of body text with only the number bold: `42 pieces of debris in 3 bags`. Rebuild it
as a Text inside a Text (no row of separate pieces). Done when `npm test` says `Tests:       9 passed, 9 total`,
and `npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Optional:** `npm run web` shows all three in the web preview. Look at the starter there first: the web preview
draws `padding: '12px'` (the browser understands px), which is exactly why it is not proof of what a phone does.
Stop it with Ctrl+C.
