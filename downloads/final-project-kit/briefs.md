# Final Project Client Briefs

React Native & Expo: Build and Ship a Mobile App, Lesson 10.1. Every client, person and business here
is fictional; use `example.com` addresses in your sample data. Each brief is sized for the course's
stack: one Expo app built from the starter, data from the app's own mock API (or only the phone), and
about 30 hours of work. Each one says which device features are in scope and how the data is served,
because those two decisions shape everything else. Read the "Notes" before you choose: they point at
the decisions that make each brief interesting.

How the data is served, in every brief:

- **The brief's own mock API** means the starter's `src/mock-api`: you write the routes and rules the
  brief describes, the app uses them in demo mode (`EXPO_PUBLIC_API_URL=demo`), and the tests use them
  through MSW. A real server is never required; if you build or rent one, cost it honestly (Lesson 9.4).
- **Local-only** means the data lives on the phone (SQLite, AsyncStorage, files: Lesson 5.3) and no
  server exists. The mock API can still stand in for anything the brief imports.

## 1. Copperline Couriers (bicycle delivery co-op)

**Client:** a three-rider bicycle courier co-op that delivers bread, flowers and print jobs for shops
in one town. Today the run sheet is a printed page and proof of delivery is a text message.

**People who use it:** riders (today's run, one stop after another, often with gloves on and one bar of
signal); the dispatcher (reads, at the end of the day, what was delivered and what failed).

**Must-haves**
- Today's run sheet for the signed-in rider, in the order of the drop-off windows
- A stop's screen: pickup and drop-off, the window, the note ("Side door"), and "Open in Maps"
- Status one step at a time: assigned, picked up, then delivered (with a photo) or failed (with a reason)
- Proof of delivery: a photo of the parcel at the door, taken in the app
- Changes made without signal are kept and sent when the phone is back online, never twice

**They already have:** two riders, about 20 stops a day, the shops' addresses.

**Device features in scope:** camera (proof photo), opening the maps app (a link, no map screen),
haptics on "Delivered", an offline queue with ids made on the phone.

**Data:** the brief's own mock API: `GET /deliveries?rider=`, `GET /deliveries/:id`,
`PATCH /deliveries/:id`, and a photo upload you design.

**Notes:** this is the worked example in the lesson (Milestone 1). The status order is a rule the
server must keep (a skipped step is a `409`), and a `Record<DeliveryStatus, …>` table keeps the labels
and the allowed next steps complete. Big buttons: riders press them with gloves (Lesson 8.1's targets).
Sign-in can be a simple rider picker in the demo; say so in the worksheet.

**Out of scope:** live GPS tracking of riders, payments, push messages from dispatch.

## 2. Kestrel Ridge Trail Stewards (volunteer trail reports)

**Client:** a volunteer group that looks after 40 km of hiking trails. Hikers and volunteers report
fallen trees, washouts and broken signs; a crew leader decides what to fix first.

**People who use it:** reporters (in the woods, usually without signal); crew leaders (sort the
reports, mark them fixed).

**Must-haves**
- A new report: kind of problem, how bad (a choice of three), a note, one to three photos
- The report's place from the phone's location, asked for when the reporter presses "Use my location",
  with a way to go on without it (a trail and a marker number picked from a list)
- Reports made offline wait on the phone and are sent later, each exactly once
- A list of open reports, nearest first when the location is known; a report's screen with a map
- Crew leaders mark a report fixed; reporters see that their report was fixed

**They already have:** 12 trails with marker numbers and their coordinates, 30 old reports.

**Device features in scope:** location (when in use only), camera and photo library, a map with
markers (react-native-maps, with the web stand-in from Lesson 6.3), the offline queue.

**Data:** the brief's own mock API: trails, reports, photos; reports carry a `clientId` made on the
phone, and the mock API answers a resend with the report it already has.

**Notes:** this brief is about "no" and "not now": no permission, no signal, no fix yet. Plan each of
those states in the worksheet before any screen. Location stays on the phone unless a report is sent:
your privacy inventory (Lesson 9.4) says exactly when it leaves.

**Out of scope:** user accounts with passwords (a name typed once is enough), push notifications.

## 3. Pocket Pantry (household food, local-only)

**Client:** a family of five that throws away too much food. They want to know what is in the
cupboard and the fridge, and what to use up first.

**People who use it:** anyone in the household, on their own phone (no sharing between phones).

**Must-haves**
- Add food: name, where it is (fridge, freezer, cupboard), how many, and a use-by date
- The list grouped by "use today", "this week" and "later", searchable
- A reminder the evening before something's use-by date, which the person can turn off
- Use one (a stepper) or remove it; swipe to remove, with a visible Remove button too
- Share a shopping list of what ran out, as text, through the share sheet

**They already have:** nothing digital: start the app with about 15 sample foods.

**Device features in scope:** local notifications (scheduled on the phone), sharing, haptics, gestures.

**Data:** local-only: SQLite for the food (you search, sort and group it), AsyncStorage for settings.
No server, no account.

**Notes:** the only brief without a server: its production build needs no `https://` address, so
change the check in `app.config.ts` on purpose and say why in the worksheet. Dates are the trap here:
a use-by day is a calendar day in the phone's time zone, not an instant. Keep `src/mock-api` only if
it still helps your tests; your repository functions get tests of their own.

**Out of scope:** barcode scanning, recipes, sharing a pantry between phones.

## 4. Fernway Swim School (parents' lesson app)

**Client:** a swim school with two pools and about 300 children in weekly classes.

**People who use it:** parents (one or more children each; check class times, report an absence, book
a makeup class); the front desk (outside the app: it already has an office system).

**Must-haves**
- Sign in as a parent (sample accounts in the demo), and stay signed in securely
- This week's classes for each child, with the pool, the time and the instructor's first name
- Report an absence; book a makeup class from the open places (the server decides, and says when a
  place has just gone)
- A reminder an hour before each class, per child, that the parent can turn off
- A link to a class that one parent can send another ("Can you take her on Tuesday?")

**They already have:** 2 pools, 25 class groups, 3 sample parents with 1 to 3 children each.

**Device features in scope:** SecureStore for the session, local notifications, deep links, haptics.

**Data:** the brief's own mock API: sign-in, children, classes, absences, makeups; `409` when a makeup
place has gone.

**Notes:** two decisions carry this brief: who may see what (a parent sees only their own children:
the mock API must refuse the rest, and a test proves it), and what a link opens for someone who is
not signed in (Lesson 4.4). Children's data is sensitive: collect as little as the must-haves need,
and write the privacy inventory early.

**Out of scope:** payments, messages with instructors, the front desk's own screens.

## 5. Ostrander Makerspace (tool checkout)

**Client:** a community workshop with 80 members and about 60 tools that leave the building: drills,
sanders, a tile cutter, a pressure washer.

**People who use it:** members (see what is in, check a tool out, bring it back); volunteers on duty
(see what is out and overdue).

**Must-haves**
- The tool list with categories, "in" or "out until …", and a picture with a description
- Check a tool out by its four-letter code on the tool's tag, for one to seven days
- A member has at most three tools out; a tool that is out cannot be checked out again (both are
  server rules: `409` with the reason)
- My tools: what I have and when each is due, overdue first
- Return a tool, with its condition (fine, needs attention) and an optional photo

**They already have:** 60 tools with photos and tag codes, 80 members, 10 tools out today.

**Device features in scope:** camera (a condition photo), haptics, local reminders the day a tool is
due; scanning the tag's QR code with `expo-camera` is an **optional stretch** (the course used
`expo-image-picker`, not barcode scanning: read the SDK 58 docs and say in the worksheet what you
verified on a real phone).

**Data:** the brief's own mock API: tools, members, loans.

**Notes:** "out", "overdue" and "how many tools I have" are computed from the loans, never stored as
flags that can disagree. Typing a code is the must-have; scanning only saves time.

**Out of scope:** fines, payments, booking a tool for a later day.

## 6. Brightwater Birding Circle (sightings journal)

**Client:** a birding club whose members keep a list of every bird they see, and compare their year's
totals at the winter meeting.

**People who use it:** members, on walks, one hand on the binoculars.

**Must-haves**
- Add a sighting fast: pick the species from a long searchable list, a count (a stepper), the time
- The place, from the phone's location if the member allows it, rounded so a nest is never exact
- My sightings by day; my year list (each species once, with the first time it was seen)
- An animated tally of the year's species that respects Reduce Motion
- Export the journal as a CSV file through the share sheet

**They already have:** a species list of about 350 birds (name, family) as a JSON file.

**Device features in scope:** location (when in use, rounded), sharing files, Reanimated, a big list
(FlashList), haptics.

**Data:** local-only: the species list bundled with the app, sightings in SQLite.

**Notes:** 350 species is where Lesson 3.2's measurements matter: measure, don't guess. The year list
is a query, not a second copy of the data. Rounding the location is a privacy decision: write down how
much and why.

**Out of scope:** photos of birds, sharing sightings with other members, accounts.

## 7. Cinder Lane Pottery Studio (firing queue)

**Client:** a shared pottery studio. Members leave pieces on a shelf to be fired; the studio tech
fires them in batches, and members keep asking "is my bowl done yet?"

**People who use it:** members (add a piece, see where it is); the studio tech (moves pieces through
the kiln steps).

**Must-haves**
- Add a piece: a photo, the clay body, the glaze wanted, the member's shelf number
- Each piece moves through greenware, bisque fired, glazed, glaze fired, ready to collect, collected
- The tech moves several pieces at once (a batch), only one step forward, never back
- Members see their pieces, "ready to collect" first, with a badge on the tab
- The member's own pieces appear even when the studio's Wi-Fi is down (the last answer, saved)

**They already have:** 25 members, 6 clay bodies, 12 glazes, about 40 pieces on the shelves.

**Device features in scope:** camera and photo library, tabs with a badge, a cached last answer for
offline reading; push notifications are out of scope (they need a server and a development build:
explain in the worksheet what the app does instead).

**Data:** the brief's own mock API: members, pieces, steps; a batch move is one request that succeeds
or fails as a whole.

**Notes:** two roles in one app: decide in the worksheet whether the tech's screens are a tab only the
tech sees, or a separate area. "Never back" and "one step at a time" are server rules with tests.

**Out of scope:** payments for firing, kiln temperature logs, glaze recipes.

## Your own idea

You may bring your own app instead. Check its size against these rules first: a project that is too
big is the most common reason final projects stall.

- Three to six must-haves, written as things a person does ("log a sighting"), not as features
- Five to ten screens, at most two kinds of people using it
- Data from the starter's mock API or only the phone; no paid service required to finish it
- At least two device features from Module 6, used for a real reason, and one plan for "offline"
- Something you can show working on a phone, in a preview build or in a recording (rubric row 10)
- Not about health, money or children's data unless you have thought hard about privacy (Lesson 9.4)

Then write it up in the same shape as the briefs above (client, people, must-haves, what they already
have, device features in scope, data, notes, out of scope), and show it to your peer reviewer before
you start: they will review your project against it.
