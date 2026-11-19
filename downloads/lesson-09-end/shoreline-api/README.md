# shoreline-api

A small mock back end for **Shoreline Crew**, a (fictional) volunteer group that cleans up beaches. The
organizers' web app you build in *React + TypeScript: Build a Modern Web App* (Shoreline Crew HQ) and the
volunteers' phone app in the React Native course both talk to it.

- **No install, no dependencies.** Node.js 24 or newer runs the TypeScript files directly.
- **Sample data** that is the same every time, with cleanup dates placed around today.
- **Real API behavior** to practice with: pagination headers, filters, validation errors with a message per
  field, sign-in with two roles, CORS for local development, and switches that make answers slow or failing.
- **The data lives in memory.** Restart the server (or `POST /api/_reset`) to get the sample data back.

## Run it

```bash
cd shoreline-api
node server.ts
```

```
Shoreline Crew API running at http://localhost:4000/api
```

Open <http://localhost:4000/api> in a browser to see every endpoint. Stop the server with <kbd>Ctrl</kbd>+<kbd>C</kbd>.

| Option | What it does |
|---|---|
| `--latency=800` or `--latency=300-1500` | wait before every answer (practice loading states) |
| `--fail-rate=0.2` | about 1 request in 5 answers `500` (practice error states) |
| `--port=4100` (or `PORT=4100`) | another port |
| `--host` | also listen on your network, so a phone on the same Wi-Fi can reach it (React Native) |
| `--today=2026-06-01` | build the sample data around another date |
| `--cors=https://my-hq.netlify.app` | let a deployed site read the API (comma-separated list, or `*`) |
| `--quiet` | do not log each request |

One request can be slowed down or failed without restarting: add `?_delay=2000` or `?_status=500` to its URL.

`npm start` runs `node server.ts`, `npm run dev` restarts it when a file changes, `npm test` runs the API's own
tests (`node --test`). None of them needs `npm install`.

## Sample accounts

Every account's password is **`shoreline-demo`**.

| Person | Email | Role |
|---|---|---|
| Maya Okafor | `maya.okafor@example.com` | organizer |
| Luis Romero | `luis.romero@example.com` | organizer |
| Hannah Becker | `hannah.becker@example.com` | organizer |
| Theo Nakamura | `theo.nakamura@example.com` | volunteer |
| 20 more volunteers | `first.last@example.com` | volunteer |

For quick experiments with curl, two tokens always work: `Authorization: Bearer dev-organizer` (Maya) and
`Authorization: Bearer dev-volunteer` (Theo).

## Endpoints

All under `/api`. Bodies are JSON. Lists answer with a JSON array plus `X-Total-Count`, `X-Total-Pages` and
`Link` headers; they take `page` (from 1) and `perPage` (1-50, default 10).

| Method and path | Who | What |
|---|---|---|
| `GET /api` | anyone | the list of endpoints |
| `GET /api/meta` | anyone | organization name, time zone, today's date, skills and debris categories with labels |
| `GET /api/health` | anyone | `{ "ok": true }` |
| `POST /api/auth/sign-in` | anyone | `{ email, password }` → `{ token, user }` |
| `POST /api/auth/sign-out` | signed in | ends the session (204) |
| `GET /api/auth/me` | signed in | the signed-in `user` |
| `GET /api/sites`, `GET /api/sites/:id` | anyone | the six cleanup sites (with a picture) |
| `GET /api/events` | anyone | cleanups; filters `q`, `status`, `siteId`, `when=upcoming\|past`, `from`, `to`, `updatedSince`, `sort=date\|-date\|title` (drafts only for organizers) |
| `GET /api/events/:id` | anyone | one cleanup with its `site` (organizers also get `checkInCode`) |
| `POST /api/events` | organizer | create (201); a `draft` unless `status: "scheduled"` |
| `PATCH /api/events/:id` | organizer | change any fields, including `status` |
| `DELETE /api/events/:id` | organizer | delete a draft (204); scheduled cleanups are cancelled instead |
| `GET /api/events/:id/signups` | organizer | the roster: sign-ups with each volunteer's contact details |
| `POST /api/events/:id/signups` | signed in | sign yourself up (organizers may send `volunteerId`); `waitlisted` when full |
| `PATCH /api/signups/:id` | organizer, or the volunteer to cancel | `{ status }`; a freed spot goes to the first person waiting |
| `GET /api/me/signups` | signed in | your sign-ups, each with its `event` |
| `POST /api/events/:id/check-in` | signed in | `{ code }` on the day of the cleanup → your sign-up becomes `attended` |
| `GET /api/events/:id/logs` | signed in | debris logs (organizers: all; volunteers: their own) |
| `POST /api/events/:id/logs` | signed in, with a spot | a debris log from the phone; resending the same `clientId` returns the saved log (200) instead of a duplicate |
| `GET /api/events/:id/impact` | anyone | the impact report of a completed cleanup |
| `PUT /api/events/:id/impact` | organizer | create or replace the impact report (the cleanup becomes `completed`) |
| `GET /api/impact` | anyone | totals for the dashboard: weight, bags, hours, by debris category, by month, by site; `from`, `to` |
| `GET /api/volunteers` | organizer | the crew; filters `q`, `skill`, `role` |
| `GET /api/volunteers/:id` | organizer, or that volunteer | one person |
| `POST /api/photos` | signed in | upload a JPEG, PNG or WebP (5 MB max) as `multipart/form-data` field `photo`, or as the raw body with its `Content-Type`; → `{ id, url, … }` (201) |
| `GET /api/photos/:id` | anyone | the uploaded image |
| `POST /api/_reset` | anyone | put the sample data back (development only) |

## Errors

Every error has the same JSON body:

```json
{
  "error": "validation_failed",
  "message": "Some fields need attention.",
  "fieldErrors": {
    "title": ["Use at least 5 characters for the title."],
    "capacity": ["Capacity must be a whole number from 1 to 200."]
  }
}
```

| Status | `error` | When |
|---|---|---|
| 400 | `validation_failed` | a field or query parameter is wrong (`fieldErrors` says which) |
| 401 | `unauthorized` | not signed in, wrong password, or the session ended |
| 403 | `forbidden` | signed in, but your role cannot do this |
| 404 | `not_found` | no such item (or a draft you cannot see) |
| 405 | `method_not_allowed` | the path exists with other methods (see the `Allow` header) |
| 409 | `conflict` | the request is fine but the data says no (already signed up, not open, not today) |
| 413 / 415 | `payload_too_large` / `unsupported_media_type` | photo uploads |
| 500 | `server_error` | a simulated failure (`--fail-rate`, `?_status=500`) or a bug |

## Types

`core/types.ts` describes every resource, request body, query and error. Apps copy it into their own code
(`src/api/types.ts`) so the compiler knows exactly what the API sends. It contains only types.

## In tests: MSW handlers

`msw/handlers.ts` runs this API's own code inside [Mock Service Worker](https://mswjs.io/) 3, so component tests
get the same data, rules and headers without a server. Copy `core/` and `msw/` into your app (for example
`src/mocks/`), then:

```ts
import { setupServer } from 'msw/node'
import { createHandlers } from './mocks/msw/handlers.ts'

export const { handlers, api } = createHandlers({ today: '2026-06-01' })
export const server = setupServer(...handlers)
// beforeAll: server.listen({ onUnhandledFrame: 'error' })   beforeEach: api.reset()
```

## Files

```
server.ts          the HTTP server (Node's http module) and its options
core/types.ts      the shared types
core/seed.ts       the sample data, built around a date
core/api.ts        every endpoint: a web-standard Request in, a Response out (no Node APIs)
msw/handlers.ts    the same API for MSW (tests and the browser)
public/images/     the site pictures (original illustrations)
test/              node --test
```
