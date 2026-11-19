// Emptying the queue: sends one volunteer's waiting reports, oldest first, one at a time, and
// decides from each answer whether a report is done, refused, or still waiting
import { onlineManager } from '@tanstack/react-query';

import { useHazardQueue } from './hazardQueue';
import type { HazardReport } from './types';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

// 201 the first time; 200 when the server already has this clientId (an earlier answer was lost)
async function postReport(api: string, token: string, report: HazardReport): Promise<void> {
  const response = await fetch(`${api}/api/sites/${report.siteId}/hazards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
        ? body.message
        : `The server answered ${response.status}.`;
    throw new ApiError(response.status, message);
  }
}

export type Sender = {
  api: string;
  volunteerId: string; // whose reports to send
  token: string; // that volunteer's sign-in
  onSignInEnded: () => void;
};

/** Safe to call as often as you like: offline, while a send runs, or with nothing waiting, it does nothing. */
export async function sendWaitingReports({ api, volunteerId, token, onSignInEnded }: Sender): Promise<void> {
  const queue = useHazardQueue.getState();
  if (queue.sending || !onlineManager.isOnline()) {
    return;
  }
  const waiting = queue.reports.filter(
    (item) => item.volunteerId === volunteerId && item.status === 'waiting',
  );
  if (waiting.length === 0) {
    return;
  }
  queue.setSending(true);
  try {
    for (const item of waiting) {
      const { clientId } = item.report;
      try {
        await postReport(api, token, item.report);
        useHazardQueue.getState().remove(clientId);
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          onSignInEnded(); // keep everything for the next sign-in
          break;
        }
        if (error instanceof ApiError && error.status < 500) {
          // A "no" about this report: asking again unchanged gets the same answer
          useHazardQueue.getState().change(clientId, { status: 'refused', problem: error.message });
        } else {
          // No answer, or server trouble: keep it, count the try, stop until the next chance
          useHazardQueue.getState().change(clientId, { attempts: item.attempts + 1 });
          break;
        }
      }
    }
  } finally {
    useHazardQueue.getState().setSending(false);
  }
}
