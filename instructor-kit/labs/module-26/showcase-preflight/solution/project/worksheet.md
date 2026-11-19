# Final Project Planning Worksheet

React Native & Expo: Build and Ship a Mobile App, Lesson 10.1. Copy this file into your project folder
(next to `package.json`) and fill it in. Every section names the lessons whose "For your own app" notes
feed it: open your course journal next to this file and start from what you already wrote. Keep it in
Git with the code; it is the first thing a peer reviewer reads. Short answers are fine; empty ones are not.

Project name: Saltwick Kayaks
Brief (one of the lesson's briefs, or your own idea): my own idea, Saltwick Kayak Hire (a harbor kayak rental)
Your name: Rosalind Achebe
Peer reviewer: Kofi Lindgren

---

## 0. Charter (journal: 1.1, today)

| Question | Your answer |
|---|---|
| Who is the client, in one sentence? | A family-run harbor shop that rents eight single and tandem kayaks by the hour |
| Who uses the app, where are they when they open it, and what do they come to do? | Two staff at the rental hut, phone in a dry bag: book a kayak, hand it out, take it back, see who is late |
| What must work on day one? (the must-haves, at most six) | Today's bookings per kayak; a new booking (never twice for the same time); out and returned one step at a time; late kayaks first |
| What would be nice later? (not in this project) | Online booking for customers; deposits |
| What is out of scope, on purpose, and why? | Payments (store and legal rules, a server we do not have); customer accounts (first names only) |
| What must it do with no signal? (your Lesson 1.1 answer, revisited) | Show today's bookings and mark a kayak out or returned; the change is sent once, later |
| The sentence you wrote in Lesson 1.1 ("I shipped…", "I can…"): does this project prove it? | "I can plan and ship a phone app for a real business": yes, as a preview build two staff used |
| How will the client know it works? (one sign you can check on a phone) | A whole Saturday of rentals without the paper sheet |

## 1. Phones and how you will run it (journal: 1.2, 9.2)

| Question | Your answer |
|---|---|
| Which phones do its people carry (iPhone, Android, both)? | |
| Which will you test on, and how (Expo Go on your phone, the Android emulator, the iOS Simulator on a Mac, the web preview)? | |
| Which features need a development build instead of Expo Go (Lesson 9.2), and when will you make one? | |
| A platform you cannot test on yet: what will you do about it? | |

## 2. Types first (journal: 1.3)

Write these in `src/api/types.ts` before any screen, next to the starter's `Item`.

Main types:

| Type | Properties (name: type) | Optional or `null`, and why | Example record |
|---|---|---|---|
| | | | |

Unions (statuses, categories, roles) and their `Record` tables (labels, next steps, colors):

| Union | Values | Tables keyed by it |
|---|---|---|
| | | |

Values that are computed, never stored (totals, "overdue", "available", distance):

| Value | Computed from | Where (function name) |
|---|---|---|
| | | |

Data from outside the code (API answers, storage, deep-link params, files) and what checks each:

| Data | Comes from | Checked by |
|---|---|---|
| | | |

## 3. Look and feel (journal: 2.1, 2.2, 2.3, 2.5)

| Question | Your answer |
|---|---|
| Color roles by job (page, surface, text, heading, action, error, …), each with a day and a night value; which pairs sit on each other, and their contrast | |
| Text variants the first screens need | |
| Pictures: which, shipped in the app or from a server (with sizes)? | |
| Icons by job (five), and the SF Symbol / Material Symbol for each | |
| A brand font, or the phone's own? | |
| What changes on a wide screen (a tablet, a phone on its side): structure, or only a maxWidth? | |
| Anything that should really differ between iPhone and Android? | |

## 4. Screens and navigation (journal: 2.2, 4.1, 4.2, 4.3, 4.4)

| File in `src/app` | Screen | Tab, stack or modal | Everyone / signed in / guests only | Data it needs first | Loading / error / empty words |
|---|---|---|---|---|---|
| `_layout.tsx` | the root stack | | | | |
| `index.tsx` | | | | | |
| `+not-found.tsx` | Not found | | everyone | none | |

- Tabs (the three to five places people return to all the time):
- The app's scheme, and the three or four screens worth linking to (`scheme://…`), what is underneath each,
  and what each shows for an id that does not exist:
- Where a dead end could come from, and where it sends people:

## 5. Lists (journal: 3.1, 3.2)

| List | One item is (type) | Its key | Loading / failed / empty words | Grouped? Headings? | How long in a year? Paged? |
|---|---|---|---|---|---|
| | | | | | |

The one list number you will measure first, and how:

## 6. Controls and forms (journal: 2.4, 5.4)

Every control on the main screen: what a finger does, its feedback, its target size, what a screen
reader says.

| Form | Field | Keyboard (`inputMode`, `autoComplete`) | Return key does | Thumb control instead? | Rules (schema) |
|---|---|---|---|---|---|
| | | | | | |

Which records get an id made on the phone (anything created on the server through a queue)?

## 7. Data and the (mock) API (journal: 5.1, 5.2, 8.2)

Where the data comes from while you build, and the address each device needs (copy into `.env.example`):

| Runs in | `EXPO_PUBLIC_API_URL` |
|---|---|
| Expo Go, emulator, web preview | `demo` |
| (a real server, if any) | |

The mock API's routes and their rules (one file per resource in `src/mock-api`):

| Method and path | Answers | Rules (with the status code when broken) | Test name |
|---|---|---|---|
| | | | |

The rule that must never break, whatever a phone sends (it gets its own test):

Server data and its query keys, general to specific (Lesson 5.2):

| Data | Query key | Depends on (who, filters, page) |
|---|---|---|
| | | |

Changes people make:

| Change | Waits for the server, or shows at once? | Keys it makes out of date |
|---|---|---|
| | | |

## 8. Storage and offline (journal: 5.3, 5.5)

| Data the app keeps | Where (memory, AsyncStorage, SecureStore, SQLite, files, server) | After a restart | After an update | After sign-out |
|---|---|---|---|---|
| | | | | |

What a person creates, and whether it needs a queue: ids made on the device; which answers mean done,
refused, signed out and "try later"; where the person sees what has not been sent yet:

What the app shows with no connection at all:

## 9. Device features and permissions (journal: 6.1, 6.2, 6.3, 6.4, 6.5)

| Feature | The button or moment that needs it | Permission and purpose string | After "no" | Could you drop it? |
|---|---|---|---|---|
| | | | | |

- Photos or files: largest size, how you shrink them, where they wait, when they are deleted:
- Places: what the location is used for, whether it leaves the phone, the map (and its web stand-in):
- Messages: every reminder, in its exact words and time, and how to turn it off:
- The two or three moments that deserve a buzz, and the one file a person would want to take out:

## 10. Motion and gestures (journal: 7.1, 7.2, 7.3)

| Motion or gesture | What it explains | With Reduce Motion | The visible button that does the same |
|---|---|---|---|
| | | | |

## 11. Accessibility (journal: 8.1)

| Screen and state | What a screen reader says | At the largest text size | Fixed in (commit) |
|---|---|---|---|
| | | | |

## 12. Tests and performance (journal: 8.2, 8.3, 8.4)

- The three pieces of logic whose failure would cost a user something they cannot see:
- The one screen people could not do without: its three most important tests, as sentences, and the
  roles and names each test searches for:
- The packages your app needs most, and how you will measure what each costs (Atlas, the Profiler,
  the performance monitor):

## 13. Config, builds and updates (journal: 9.1, 9.2, 9.3)

| Variant | Name | App id (a domain you control) | `EXPO_PUBLIC_API_URL` | Built how |
|---|---|---|---|---|
| development | | | | |
| preview | | | `demo` | |
| production | | | | |

- Every setting that changes between "on my laptop" and "in the store", and the one secret that must
  never be in the code (where it lives instead):
- Which changes you would ship as an update, and which need a new build:

## 14. Privacy and the release checklist (journal: 9.4)

Data inventory, from the code (search for every `fetch`, every native module, every SDK that talks to
the network):

| Data | Leaves the phone? | Where it goes | App Privacy (Apple) | Data safety (Google) |
|---|---|---|---|---|
| | | | | |

Does the app create accounts? (Then deletion must start in the app.)

The release checklist from Lesson 9.4. Mark each line: done, not possible in this project, or to do.

| Stage | Check | Status |
|---|---|---|
| Code | Type check, lint and tests pass (CI green); the exact build you will hand out was tried on a real phone | done |
| Identity | App ids on your own domain; name, icon and splash final; version raised | to do (icon and splash final) |
| Config | Production profile with an https:// API (or local-only, on purpose); permission sentences say why; permissions list audited; encryption answer set; secrets only in EAS environment variables | not possible yet: no https server |
| Privacy | Inventory from the code and libraries; App Privacy and Data safety answers match it; privacy policy and deletion pages; both linked from the app | done (inventory; draft answers) |
| Listing | Texts within limits; screenshots from the real app; support URL; category; ratings | not possible in this project |
| Review | A server a reviewer can reach; a demo account and anything else a reviewer needs | not possible yet: no server |
| Testing | Internal testing / TestFlight first; on a new personal Google Play account, the closed test | done: preview build to two testers |
| Release | Production release; watch crash reports; an update or rollback ready | not possible in this project |

## 15. Launch plan (rubric row 10)

Which launch, all free: a preview build from an EAS internal distribution link (a free Expo account;
Android, or iPhone with the Apple membership), a recorded demo in Expo Go or a development build on a
real phone, or (an app without device features only) a recorded demo in the web preview.

| Question | Your answer |
|---|---|
| Your launch, and why that one | |
| Who will try it (two testers if you can), on which phones | |
| What you will ask them to do (the main journey, in steps) | |
| What a store release would still need (from the checklist above) | |

## 16. Milestones and time log

Typical hours for one person who has finished the course; your own estimate goes next to them. The
whole project is about 30 hours, usually 25 to 35, best spread over four to six weeks.

| # | Milestone | Done when | Typical | Your estimate | Actual |
|---|---|---|---|---|---|
| 1 | Foundations | Names and ids yours; types, sample data, the mock API's rules and their tests; first green CI | 3-4 h | 4 h | 5 h |
| 2 | Walking skeleton | Every screen in section 4 exists and is reachable; the main list and detail show real (mock) data; `Item` deleted | 4-6 h | 5 h | 7 h |
| 3 | The main journey | Every must-have works end to end in Expo Go, forms and changes included; storage as planned | 5-8 h | 7 h | 9 h |
| 4 | Phone features and offline | Section 9's features with their permission paths; the offline plan works on a phone | 4-6 h | 5 h | 6 h |
| 5 | Quality | Accessibility pass, motion with Reduce Motion, screen tests, one performance measurement | 4-6 h | 5 h | 4 h |
| 6 | Ship | Variants and profiles, privacy inventory, release checklist, README, your launch | 3-4 h | 3 h | 4 h |
| 7 | Review | Peer review given and received, every point answered, reflection written | 2-3 h | 2 h | 2 h |

Time log (one line per working session):

| Date | Hours | Milestone | What I did | What surprised me |
|---|---|---|---|---|
| Session 25 | 2.5 | 1 | Charter, types, the overlap rule and its tests | tsc found the missing status before I did |
| Week 1, Thursday | 2.5 | 1 | Names and ids, first green CI | The app config test failed until the ids were mine |
| Week 2, Tuesday | 3.5 | 2 | Walking skeleton; Item deleted | Deleting Item gave me the whole to-do list |
| Week 5, Monday | 2 | 7 | Peer review answered | My reviewer found the late list unreadable at the largest text |
