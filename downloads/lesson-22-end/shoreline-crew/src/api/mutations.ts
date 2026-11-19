// Shoreline Crew's changes (new, in the HQ's style): a mutationOptions factory per kind of change.
// Each one says what to send, and which cached answers are out of date afterwards.
import { mutationOptions } from '@tanstack/react-query';

import { cancelSignup, checkIn, getEventLogs, postSignup } from '@/api/client';
import { mySignupsQuery, queryClient } from '@/api/queries';
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
 * Check in at the beach with the day's code. Waits for the API: only it knows the code. Offline,
 * it waits for the connection like the others (in memory: it is not saved on the phone).
 */
export function checkInMutation(eventId: string) {
  return mutationOptions({
    mutationFn: (code: string) => checkIn(eventId, code),
    // Your sign-up is now 'attended': My cleanups, the cleanup's screen and this form read it
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['signups'] }),
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
