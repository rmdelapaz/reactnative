// Shoreline Crew's changes (new, in the HQ's style): a mutationOptions factory per kind of change.
// Each one says what to send, and which cached answers are out of date afterwards.
import { mutationOptions } from '@tanstack/react-query';

import { cancelSignup, getEventLogs, postLog, postSignup } from '@/api/client';
import { mySignupsQuery, queryClient } from '@/api/queries';
import type { LogToSend } from '@/api/schemas';
import { saveSentLogs } from '@/storage/logbook';
import { toDateString } from '@/utils/format';

// A sign-up changes the spots left (on every list and cleanup screen) and your own sign-ups.
// Returning the promise keeps the mutation pending until the screens have the new answers.
function refreshSignups() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['events'] }),
    queryClient.invalidateQueries({ queryKey: ['signups'] }),
  ]);
}

/** Sign up for a cleanup. Waits for the API: it decides between a spot and the waiting list. */
export function signUpMutation() {
  return mutationOptions({
    mutationFn: (eventId: string) => postSignup(eventId),
    // onSettled, not onSuccess: after a "no" (already signed up on another phone, the last spot
    // just went) the screens need the truth too
    onSettled: refreshSignups,
  });
}

/** Cancel your sign-up. Waits too: your spot may go to the first person on the waiting list. */
export function cancelSignupMutation() {
  return mutationOptions({
    mutationFn: (signupId: string) => cancelSignup(signupId),
    onSettled: refreshSignups,
  });
}

/**
 * Copy the debris logs you sent from past cleanups into the logbook on this phone (new).
 * It asks the API and writes the phone's database, so it waits for a connection like any mutation.
 */
export function bringInSentLogsMutation(viewer: string) {
  return mutationOptions({
    mutationFn: async () => {
      // The cleanups you held a spot at, up to today: the only ones you can have logged for
      const today = toDateString(new Date());
      const signups = await queryClient.fetchQuery(mySignupsQuery(viewer));
      const held = signups.filter(
        ({ status, event }) =>
          (status === 'attended' || status === 'confirmed') && event.date <= today,
      );
      // One request per cleanup, all at once; each log keeps its cleanup for the logbook
      const lists = await Promise.all(
        held.map(async ({ event }) => {
          const logs = await getEventLogs(event.id);
          return logs.map((log) => ({ log, event }));
        }),
      );
      const sent = lists.flat();
      await saveSentLogs(sent);
      return sent.length;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['logbook'] }),
  });
}

/**
 * Send a debris log from the form (Lesson 5.4), then keep a copy in the logbook on this phone.
 * Offline it waits, like every mutation, but only in memory: Lesson 5.5 makes the wait survive
 * closing the app, with a queue of LogToSend items.
 */
export function sendLogMutation() {
  return mutationOptions({
    mutationFn: ({ event, log }: LogToSend) => postLog(event.id, log),
    // The server's answer (the saved log) goes into the logbook with its cleanup
    onSuccess: async (saved, { event }) => {
      await saveSentLogs([{ log: saved, event }]);
      await queryClient.invalidateQueries({ queryKey: ['logbook'] });
    },
  });
}
