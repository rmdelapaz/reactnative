# Lab 1.2: what runs your code, and what checks it

New practice on Lesson 1.2's central idea, on two small components instead of the course app. Metro (and Jest)
RUN your code: they remove the types without checking them. Two other tools CHECK it: `npm run typecheck`
(`tsc --noEmit`, the project's type check) and `npm run lint` (`npx expo lint`, ESLint with Expo's rules). The
project's own AGENTS.md asks for both before any task is done.

**Setup:** a terminal in `labs/module-01/l1_2-your-toolchain/starter` (the shared lab install from Lab 1.1: nothing to install).

## Task 1: the tagline that lost its look (src/WelcomeBanner.tsx)

Run `npm test`: the banner renders, and its words are all there; one test says the tagline has no size and no
color. On a phone you would just see plain text, no error at all. Now run `npm run typecheck`: tsc names the
mistake, with a suggestion. Fix it. Done when both Task 1 tests pass and the type check prints nothing after its
two `>` lines.

## Task 2: green tests, red linter (src/SignUpDesk.tsx)

Both Task 2 tests pass. Run `npm run lint`: one error. Which rule does the linter quote, and what does it say about
the early return? React needs the same hooks, called in the same order, on every render of a component; this desk
breaks that rule the moment `open` changes while it is on screen, and none of the tests changes `open`. Fix the
component so the linter is clean and the tests still pass. Done when `npm test` says `Tests:       4 passed, 4 total`, and `npm run typecheck` and `npm run lint` print
nothing after their two `>` lines.

**Stretch: the debug handout.** With the API running (`node server.ts` in `shoreline-api`), run
`node debug_upcoming.ts` in this lab's folder. It has two bugs; the second only shows once the first is fixed.
Then copy your fixed file into `starter/src/` as `countUpcoming.ts` and run `npm run typecheck` there: would tsc
have caught the second bug before you ran anything?
