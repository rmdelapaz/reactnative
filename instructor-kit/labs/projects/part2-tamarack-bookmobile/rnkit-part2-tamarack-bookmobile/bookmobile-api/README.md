# bookmobile-api

The mock back end for **Bookmobile Stops** (the Tamarack County Library Bookmobile, fictional). No dependencies: Node 24 or newer runs the TypeScript
directly. You never edit it; it is the library's server.

```bash
cd labs/projects/part2-tamarack-bookmobile/bookmobile-api
node server.ts              # http://localhost:4100/api   (Ctrl+C stops it)
node server.ts --host       # also reachable from a phone on the same Wi-Fi (Lesson 5.1)
node server.ts --latency=800   # slow answers, to see the loading faces
npm test                    # the API's own tests
```

It runs next to shoreline-api (port 4000) and Metro (8081). The data lives in memory: a restart brings the sample
data back and forgets every sign-in.

| Endpoint | Answers |
|---|---|
| `GET /api/health` | `{ "ok": true, "name": "bookmobile-api" }` |
| `GET /api/stops` | the 8 weekly stops (`id`, `name`, `address`, `latitude`, `longitude`, `day`, `start`, `end`), Monday first |
| `GET /api/stops/:id` | one stop; 404 `not_found` for an unknown id |
| `GET /api/books?q=&audience=` | the 12 books by title (`id`, `title`, `author`, `audience`, `onVan`); `q` matches a title or an author |
| `POST /api/auth/sign-in` `{ cardNumber, pin }` | `{ token, patron }`; 400 with `fieldErrors`; 401 for a wrong card number or PIN |
| `POST /api/auth/sign-out` | 204 (Bearer) |
| `GET /api/holds` | the signed-in patron's holds (Bearer; 401 without) |
| `POST /api/holds` `{ clientId, bookId, stopId, note? }` | 201 with the new hold; **200 with the same hold when the clientId came before** (a resend, never a duplicate); 400 `fieldErrors`; 409 `already_held` / `hold_limit` (5); 401 |
| `POST /api/_reset` | the sample data back (tests and checkers) |

Library cards (fictional): **2145 0021** PIN **4821** (June Okafor: one hold ready at Ridgeline Senior Center) and
**2145 0038** PIN **1357** (Tomas Lindgren). The types of every answer are in `core/types.ts`; the app keeps a copy
as `src/api/types.ts`.
