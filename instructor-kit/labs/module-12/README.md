# Session 12 labs: Reaching the API and TanStack Query on Mobile

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Run every command from
the folder named in the task (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l5_1-reaching-the-api-from-a-phone/` | addresses as data: a `.env.local` checker, the address for each device, a health check with a time limit | the shared install |
| `l5_2-tanstack-query-on-mobile/` | the cache on a phone: the provider, offline as "paused", a list that pages itself with Load more | the shared install |

Nothing here needs a phone, the network or a running API: Jest runs the code the way React Native does, and MSW
answers the requests with real answers of shoreline-api saved in each lab's `fixtures/` folder (`npm test` runs once
and exits). `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. **One install for every lab of
the course:** `npm install` once in `shoreline/labs` (Session 1); never inside a lab folder. Nothing here changes
`shoreline-crew`: the course app's own work is the lesson projects.
