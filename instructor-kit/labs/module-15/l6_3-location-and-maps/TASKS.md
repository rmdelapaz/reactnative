# Lab 6.3: the supply van

New practice on Lesson 6.3's ideas, on something the lesson did not build: on the day of a cleanup the crew's
supply van parks near the meeting point with the gear kits (gloves, a grabber, bags). Volunteers find the van,
and pick up a kit by typing the 4-digit code on its tag. The kit endpoints are practice: MSW answers them in the
tests. No API, no phone, no map: a stand-in inside the test replaces react-native-maps.

**Setup:** a terminal in `labs/module-15/l6_3-location-and-maps/starter` (the shared lab install: nothing to
install). Run `npm test`, then the web check:

```
npx expo export --platform web --output-dir dist --clear && node web-check.mjs
```

`web-check.mjs` loads the exported bundle in Node the way a browser starts it (every module runs; no page is
drawn). Read its last line: where did you see that message today?

## Task 1: a position is a circle (src/vanHint.ts)

`vanHint` turns the phone's position into a hint: here, about N m, far (the wrong beach?). It treats the position
as a point. Under a cliff the phone may report a circle of 400 m, or no accuracy at all, and then "the van is
right here" is a guess. When the accuracy is unknown or wider than 150 m, answer `unsure` with the sentence in the
test. The hint only helps: nothing is decided with it. Done when the five Task 1 tests pass.

## Task 2: the map (src/mapLink.ts, src/VanMap.tsx, and a new file)

Three fixes, one idea each. (1) `mapLinkFor`: encode the label (`encodeURIComponent`), and on Android put the pin
at the coordinates: `geo:LAT,LNG?q=LAT,LNG(label)`. (2) `VanMap` shows the blue dot for everyone: on an iPhone
`showsUserLocation` alone makes the phone ask, with no reason given. Pass it only when `locationAllowed` is true.
(3) The web check fails: react-native-maps defines native components when it is imported, and a browser has
none. Add `src/VanMap.web.tsx` with the same props that never imports react-native-maps (the place in words, in a
box the size of the map). Done when the four Task 2 tests pass and the web check says `The web bundle loads
without an error.`

## Task 3: the pickup code (src/schemas.ts, src/PickupForm.tsx)

Kit 7's code is `0427`. The schema turns the code into a number, so `0427` is sent as `427` and two digits are
"a code" too (`npm run typecheck` noticed something as well: why is the field's value `unknown`?). Keep the code as
text (four digits, `Enter the 4-digit code on the tag.`). Then put the server's
message for a wrong code under the field (`error.fieldErrors?.code?.[0]`, with `setError('code', ...)`), and
refresh the kit after the change (`onSettled` invalidates `['kits', kitId]`): the screen then shows the kit
picked up by itself. Done when `npm test` says `Tests:       13 passed, 13 total`, the web check passes, and
`npm run typecheck` and `npm run lint` print nothing after their two `>` lines.

**Stretch:** the crew wants pickup to work only within 300 m of the van. Where would that rule have to live to be
a rule, and what would it cost the volunteer under the cliff?
