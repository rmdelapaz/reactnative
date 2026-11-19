// Emptying the queue (new): sends a volunteer's waiting debris logs, and decides from each answer
// whether a log is done, refused, or still waiting. Safe to repeat: every log keeps its clientId.
import { onlineManager } from '@tanstack/react-query';

import { ApiError, postLog, readSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import { markSignInEnded } from '@/auth/ended';
import { useLogQueue } from '@/state/logQueue';
import { saveSentLogs } from '@/storage/logbook';

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
        const saved = await postLog(item.event.id, item.log);
        await saveSentLogs([{ log: saved, event: item.event }]);
        useLogQueue.getState().remove(clientId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          markSignInEnded(); // the sign-in has ended: keep everything for the next one
          break;
        }
        if (error instanceof ApiError && error.status < 500) {
          // A "no" (403 no spot, 409 not yet, 400 a field): sending again gets the same answer
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
