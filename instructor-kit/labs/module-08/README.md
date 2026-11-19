# Session 8 labs: FlatList, SectionList and Big Lists

Your course folder's `labs/` (`shoreline/labs/`) holds every lab. Work in the `starter/` folders; `TASKS.md` in
each lab says what to do and when you are done. Run every command from the folder named in the task.

| Folder | What it is | Needs |
|---|---|---|
| `l3_1-flatlist-and-sectionlist/` | the six beaches as a list: a header that keeps your typing, columns, empty states, beaches under their towns | the shared install |
| `l3_2-big-lists-fast/` | past cleanups three at a time on FlashList: recycled rows, a paging hook that asks once, month headings | the shared install |

Both labs run without a phone and without the API: Jest renders the lists the way React Native does (`npm test`
runs once and exits), `fixtures/` holds real answers of the course API, and MSW answers Lab 3.2's requests (it
also counts them). `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. The packages come from
the one shared install (`npm install` once in `shoreline/labs`, done in Session 1): nothing to install here, and
nothing here changes `shoreline-crew`. The Part 1 project (Session 8's kickoff) is in `labs/projects/`.
