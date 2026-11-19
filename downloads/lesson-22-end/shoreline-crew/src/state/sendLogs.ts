// Emptying the queue (new): sends a volunteer's waiting debris logs, and decides from each answer
// whether a log is done, refused, or still waiting. Safe to repeat: every log keeps its clientId.
import { onlineManager } from '@tanstack/react-query';

import { ApiError, postLog, postPhoto, readSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import { markSignInEnded } from '@/auth/ended';
import { type QueuedLog, useLogQueue } from '@/state/logQueue';
import { saveSentLogs } from '@/storage/logbook';
import { forgetPhoto, readPhoto } from '@/utils/photoFiles';

/**
 * Upload a log's photos that the server does not have yet, and return the ids of all of them.
 * Each new id is saved in the queue at once: when the log itself fails, the next try sends the
 * log with that id instead of uploading the photo a second time.
 */
async function uploadPhotos({ log, photos }: QueuedLog): Promise<string[]> {
  const photoIds: string[] = [];
  for (const photo of photos) {
    let photoId = photo.photoId;
    if (photoId === null) {
      const file = await readPhoto(photo.uri);
      if (file === null) {
        continue; // the file is gone (the web preview after a reload): the log goes without it
      }
      photoId = (await postPhoto(file, photo.type)).id;
      useLogQueue.getState().setPhotoId(log.clientId, photo.uri, photoId);
    }
    photoIds.push(photoId);
  }
  return photoIds;
}

/**
 * Send one volunteer's waiting logs, oldest first, one at a time. Call it as often as you like:
 * offline, while a send is running, or with nothing waiting, it does nothing.
 */
export async function sendWaitingLogs(volunteerId: string): Promise<void> {
  const queue = useLogQueue.getState();
  if (queue.sending || !onlineManager.isOnline()) {
    return;
  }
  const waiting = queue.logs.filter(
    (item) => item.volunteerId === volunteerId && item.status === 'waiting',
  );
  if (waiting.length === 0) {
    return;
  }
  queue.setSending(true);
  try {
    for (const item of waiting) {
      // Each request carries the signed-in volunteer's token: never send someone else's log
      if (readSession()?.user.id !== volunteerId) {
        break;
      }
      const clientId = item.log.clientId;
      try {
        // 201 the first time; 200 with the same saved log if an earlier try got through
        // but its answer was lost. Either way the server has it once.
        // Photos first: the log lists their ids (the API checks that each one exists)
        const photoIds = await uploadPhotos(item);
        const saved = await postLog(item.event.id, { ...item.log, photoIds });
        await saveSentLogs([{ log: saved, event: item.event }]);
        useLogQueue.getState().remove(clientId);
        item.photos.forEach((photo) => forgetPhoto(photo.uri)); // the server has them now
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          markSignInEnded(); // the sign-in has ended: keep everything for the next one
          break;
        }
        if (error instanceof ApiError && error.status < 500) {
          // A "no" (403 no spot, 409 not yet, 400 a field, 413/415 a photo): the same answer again
          useLogQueue.getState().change(clientId, { status: 'refused', problem: error.message });
        } else {
          // No answer, or server trouble: keep it, count the try, and stop until the next chance
          useLogQueue.getState().change(clientId, { attempts: item.attempts + 1 });
          break;
        }
      }
    }
  } finally {
    useLogQueue.getState().setSending(false);
    // Read the logbook again. A first read may have started before these logs were saved, and
    // invalidating would only wait for it: cancel it first, so the new read starts after the save
    await queryClient.cancelQueries({ queryKey: ['logbook'] });
    await queryClient.invalidateQueries({ queryKey: ['logbook'] });
  }
}
