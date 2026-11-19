# Session 15 labs: Camera, Photos, Location and Maps

Work in the `starter/` folders; `TASKS.md` in each lab says what to do and when you are done. Run every command
from the lab's `starter` folder (VS Code: right-click the folder > Open in Integrated Terminal).

| Folder | What it is | Needs |
|---|---|---|
| `l6_2-camera-and-photos/` | found on the beach: photos checked when they are picked, uploaded before the item that names them, and a saved queue that changes shape | the shared install |
| `l6_3-location-and-maps/` | the supply van: a position as a circle, a map link per platform, a map with a web stand-in, a pickup code form | the shared install |

Nothing to install: both labs use the shared install in `shoreline/labs` (`npm install` once, Session 1). No
phone, no camera, no map and no API: Jest renders the components the way React Native does, MSW answers the
requests (practice endpoints; the photo endpoint answers the way shoreline-api's `POST /api/photos` does), a small
stand-in plays the phone's files, and in the maps lab a stand-in inside the test replaces react-native-maps.
`npm test` runs the tests once, `npm run typecheck` is `tsc --noEmit`, `npm run lint` is `npx expo lint`. The maps
lab also checks its web export: `npx expo export --platform web --output-dir dist --clear`, then
`node web-check.mjs` loads that bundle in Node the way a browser would start it. Nothing here changes
`shoreline-crew`.
