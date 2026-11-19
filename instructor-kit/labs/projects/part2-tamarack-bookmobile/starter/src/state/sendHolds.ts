// Emptying the queue (Lesson 5.5): sends a patron's waiting holds, and decides from each answer
// whether a hold is done, refused, or still waiting. Safe to repeat: every hold keeps its clientId.

/**
 * TODO R4b. Send one patron's waiting holds, oldest first, one at a time (src/state/sendLogs.ts in
 * Lesson 5.5 is the model). Do nothing while a send runs, offline (onlineManager.isOnline()), or
 * with nothing waiting. Stop if the signed-in patron is not patronId. For each hold, postHold():
 * - 201 or 200: remove it from the queue (200 = the API had it already: one hold, never two);
 * - 401: stop (the client has signed out; the holds wait for the next sign-in);
 * - another 4xx: mark it 'refused' with the API's message (asking again would get the same answer);
 * - no answer or 5xx: count the try (attempts + 1) and stop until the next chance.
 * At the end: sending false again, and invalidate the ['holds'] queries.
 */
export async function sendWaitingHolds(patronId: string): Promise<void> {
  throw new Error(`TODO R4b: send ${patronId}'s waiting holds`);
}
