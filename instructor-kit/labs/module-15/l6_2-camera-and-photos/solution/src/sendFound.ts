// Emptying the found-items queue: for each waiting item, its photos go up first (each id saved the
// moment it arrives), then the item with their ids. Bags first, then the tally sheet.
import { ApiError, request } from './api';
import { type QueuedItem, useFoundQueue } from './foundQueue';
import { forgetPhoto, readPhoto } from './photoFiles';
import type { FoundItem } from './types';

/** POST /api/photos: the photo itself is the body, its kind in Content-Type. Answers its id */
export async function postPhoto(photo: Blob, contentType: string): Promise<string> {
  const response = await request('/photos', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: photo,
  });
  const data: unknown = await response.json();
  if (typeof data !== 'object' || data === null || !('id' in data) || typeof data.id !== 'string') {
    throw new Error('Unexpected data from POST /api/photos');
  }
  return data.id;
}

/** POST /api/found-items: the item, naming photos the server already has */
async function postItem(item: FoundItem, photoIds: string[]): Promise<void> {
  await request('/found-items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...item, photoIds }),
  });
}

/** Upload the photos the server does not have yet; answer the ids of all of them */
async function uploadPhotos({ item, photos }: QueuedItem): Promise<string[]> {
  const photoIds: string[] = [];
  for (const photo of photos) {
    let photoId = photo.photoId;
    if (photoId === null) {
      const file = await readPhoto(photo.uri);
      if (file === null) {
        continue; // the file is gone: the item goes without it
      }
      photoId = await postPhoto(file, photo.type);
      useFoundQueue.getState().setPhotoId(item.clientId, photo.uri, photoId); // saved at once
    }
    photoIds.push(photoId);
  }
  return photoIds;
}

/** Safe to call as often as you like: while a send runs, or with nothing waiting, it does nothing */
export async function sendWaitingItems(): Promise<void> {
  const queue = useFoundQueue.getState();
  const waiting = queue.items.filter((queued) => queued.status === 'waiting');
  if (queue.sending || waiting.length === 0) {
    return;
  }
  queue.setSending(true);
  try {
    for (const { item, attempts } of waiting) {
      // read again: an earlier try may have saved photo ids
      const queued = useFoundQueue.getState().items.find((x) => x.item.clientId === item.clientId);
      if (queued === undefined) {
        continue;
      }
      try {
        const photoIds = await uploadPhotos(queued);
        await postItem(queued.item, photoIds);
        useFoundQueue.getState().remove(item.clientId);
        queued.photos.forEach((photo) => forgetPhoto(photo.uri)); // the server has them now
      } catch (error) {
        if (error instanceof ApiError && error.status < 500) {
          // A "no" (400, 413, 415...): the same answer again, so it waits for the volunteer
          useFoundQueue.getState().change(item.clientId, { status: 'refused', problem: error.message });
        } else {
          // No answer, or a busy server: count the try and stop for now
          useFoundQueue.getState().change(item.clientId, { attempts: attempts + 1 });
          break;
        }
      }
    }
  } finally {
    useFoundQueue.getState().setSending(false);
  }
}
