# Lab 6.2: found on the beach

New practice on Lesson 6.2's ideas, on something the lesson did not build: volunteers find things on the beach (a
phone, car keys, a ring) and hand them to the crew leader, who writes the item down with up to three photos so its
owner can recognize it. With no signal the item waits in a queue saved on the phone, and its photos wait with it.
The endpoints are practice: MSW answers them in the tests, and `POST /api/photos` answers the way shoreline-api's
does (JPEG, PNG or WebP only: 415 otherwise; a multipart form without an image in `photo`: 400). A small stand-in
(`src/photoFiles.ts`) plays the phone's documents folder. No API, no phone, no camera.

**Setup:** a terminal in `labs/module-15/l6_2-camera-and-photos/starter` (the shared lab install: nothing to
install). Run `npm test` and `npm run typecheck`. Read the type checker's one error from the top: where did you
see it today?

## Task 1: what the picker gave back (src/addPicked.ts)

`addPicked` adds whatever the picker calls an `'image'`. But `asset.type` only says photo or video: the file's
kind is `asset.mimeType` (`'image/heic'`, `'image/gif'`...). Keep only JPEG, PNG and WebP photos of 5 MB or
smaller, never more than three in all, and say in one sentence how many were not added: `One photo was not
added: ...` or `3 photos were not added: ...` (the test has the whole sentence). Done when the four Task 1
tests pass.

## Task 2: bags first, then the tally sheet (src/sendFound.ts)

The sender uploads photos the way most answers online do: a `FormData` part made of the file's address. Read the
type checker's error, then send the photo itself as the body, with its kind in `Content-Type` (`readPhoto` gives
you the file: a Blob). Then make a retry safe: shoreline-api stores every upload as a new photo, so save each id
with `setPhotoId` the moment it arrives and skip photos that already have one. A photo whose file is gone is
skipped (the item still goes), and the files are deleted (`forgetPhoto`) once the server has the item. Done when
the four Task 2 tests pass.

## Task 3: the queue changes shape (src/foundQueue.ts)

Items saved before photos existed have no `photos` list, so the saved-data check throws them away: a volunteer
who updates the app loses yesterday's items. Give the saved queue `version: 1` and a `migrate` that gives a
version-0 item an empty photo list (then keep only the items that pass the check). Done when `npm test` says
`Tests:       11 passed, 11 total`, and `npm run typecheck` and `npm run lint` print nothing after their two `>`
lines.

**Stretch:** why does the queue save each photo's `uri` and never the image itself? (Hint: what AsyncStorage
holds, and how often the app reads it.)
