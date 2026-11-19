// Emptying the found-items queue: for each waiting item, its photos go up first (each id saved the
// moment it arrives), then the item with their ids. Bags first, then the tally sheet.
import { ApiError, request } from './api';
import { type QueuedItem, useFoundQueue } from './foundQueue';
import type { FoundItem } from './types';

/** POST /api/photos, the way most answers online do it. Answers its id */
export async function postPhoto(photo: { uri: string; type: string }): Promise<string> {
  // the classic React Native upload: a FormData part made of the file's address
  const body = new FormData();
  body.append('photo', { uri: photo.uri, name: 'photo.jpg', type: photo.type });
  const response = await request('/photos', { method: 'POST', body });
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

/** Upload the item's photos; answer their ids */
// TODO (Task 2): what if the photos went up, and only the item's answer was lost?
async function uploadPhotos({ photos }: QueuedItem): Promise<string[]> {
  const photoIds: string[] = [];
  for (const photo of photos) {
    photoIds.push(await postPhoto(photo));
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
