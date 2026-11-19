// Emptying the queue (Lesson 5.5): sends a patron's waiting holds, and decides from each answer
// whether a hold is done, refused, or still waiting. Safe to repeat: every hold keeps its clientId.
import { onlineManager } from '@tanstack/react-query';

import { ApiError, postHold, readSession } from '@/api/client';
import { queryClient } from '@/api/queries';
import { useHoldQueue } from '@/state/holdQueue';

/**
 * TODO R4b (done). Send one patron's waiting holds, oldest first, one at a time. Call it as often as
 * you like: offline, while a send is running, or with nothing waiting, it does nothing.
 */
export async function sendWaitingHolds(patronId: string): Promise<void> {
  const queue = useHoldQueue.getState();
  if (queue.sending || !onlineManager.isOnline()) {
    return;
  }
  const waiting = queue.holds.filter((item) => item.patronId === patronId && item.status === 'waiting');
  if (waiting.length === 0) {
    return;
  }
  queue.setSending(true);
  try {
    for (const item of waiting) {
      // Each request carries the signed-in patron's token: never send someone else's hold
      if (readSession()?.patron.id !== patronId) {
        break;
      }
      const { clientId, bookId, stopId, note } = item;
      try {
        // 201 the first time; 200 with the same hold if an earlier try got through but its answer was lost
        await postHold({ clientId, bookId, stopId, note });
        useHoldQueue.getState().remove(clientId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          break; // the sign-in has ended: keep everything for the next one
        }
        if (error instanceof ApiError && error.status < 500) {
          // A "no" (409 already held, 400 a field): asking again would get the same answer
          useHoldQueue.getState().change(clientId, { status: 'refused', problem: error.message });
        } else {
          // No answer, or server trouble: keep it, count the try, and stop until the next chance
          useHoldQueue.getState().change(clientId, { attempts: item.attempts + 1 });
          break;
        }
      }
    }
  } finally {
    useHoldQueue.getState().setSending(false);
    await queryClient.invalidateQueries({ queryKey: ['holds'] });
  }
}
