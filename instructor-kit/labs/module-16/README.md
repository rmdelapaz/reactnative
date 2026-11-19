# Session 16 labs: Notifications, Haptics, Sharing and Files

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Run every command
from the lab's `starter` folder (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l6_4-notifications/` | gear back on time: reminders the day before a borrowed tool is due, kept in step with the loans, and a tap that may open only a loan | the shared install |
| `l6_5-haptics-sharing-and-files/` | the gear shed's inventory: a CSV file a spreadsheet trusts, a buzz that respects the switch, a share function the web preview survives | the shared install |

Nothing to install: both labs use the shared install in `shoreline/labs` (`npm install` once, Session 1). No
phone and no API: the tests stand in for the phone's notification scheduler, its haptics motor, its files and
its share sheet, so they can check what your code ASKED the phone to do. What the phone then shows (a
notification on the lock screen, a tap you can feel, the share sheet) is for your phone, as the lessons say.
`npm test` runs the tests once, `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`.
Nothing here changes `shoreline-crew`.
