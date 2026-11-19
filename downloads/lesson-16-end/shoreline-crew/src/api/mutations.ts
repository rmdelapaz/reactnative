// Shoreline Crew's changes (new, in the HQ's style): a mutationOptions factory per kind of change.
// Each one says what to send, and which cached answers are out of date afterwards.
import { mutationOptions } from '@tanstack/react-query';

import { cancelSignup, postSignup } from '@/api/client';
import { queryClient } from '@/api/queries';

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
