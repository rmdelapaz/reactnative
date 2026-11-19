import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { describeError } from '@/api/client';
import { cancelSignupMutation, signUpMutation } from '@/api/mutations';
import { mySignupsQuery, viewerId } from '@/api/queries';
import type { CleanupEvent } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useSession } from '@/hooks/useSession';
import { spacing } from '@/theme/spacing';
import { getAvailability } from '@/utils/availability';
import { toDateString } from '@/utils/format';

type SignupPanelProps = {
  event: CleanupEvent;
};

// The volunteer's part of a cleanup's screen: sign up, see where you stand, or cancel
export function SignupPanel({ event }: SignupPanelProps) {
  const session = useSession();
  // Your sign-ups (the same cache entry My cleanups uses); guests have none to ask for
  const signups = useQuery({ ...mySignupsQuery(viewerId(session)), enabled: session !== null });
  const signUp = useMutation(signUpMutation());
  const cancel = useMutation(cancelSignupMutation());

  if (session === null) {
    return (
      <View style={styles.panel}>
        <AppText>Sign in to sign up for this cleanup.</AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in to sign up" variant="primary" />
        </Link>
      </View>
    );
  }

  if (signups.data === undefined) {
    // Rare: the sign-ups could not load. The screen still works; the panel waits for them.
    return signups.isError ? (
      <AppText variant="muted">
        Could not check your sign-ups: {describeError(signups.error)}
      </AppText>
    ) : (
      <AppText variant="muted">Checking your sign-ups…</AppText>
    );
  }

  // Your sign-up for this cleanup, if you hold a spot or wait for one
  const mine = signups.data.find(
    ({ eventId, status }) =>
      eventId === event.id && (status === 'confirmed' || status === 'waitlisted'),
  );
  const availability = getAvailability(event);
  // The API takes sign-ups for scheduled cleanups from today on
  const open = availability.kind !== 'closed' && event.date >= toDateString(new Date());
  // A full cleanup still takes sign-ups: they join the waiting list
  const signUpLabel = availability.kind === 'full' ? 'Join the waiting list' : 'Sign up';
  // The last change that failed, in words (each button forgets the other's failure)
  const error = signUp.error ?? cancel.error;
  // Offline, a mutation waits for the connection and is sent when the phone is back online
  const waiting = signUp.isPaused || cancel.isPaused;

  return (
    <View style={styles.panel}>
      {mine === undefined && open && (
        <Button
          label={signUp.isPending ? 'Signing up…' : signUpLabel}
          variant="primary"
          disabled={signUp.isPending}
          onPress={() => {
            cancel.reset();
            signUp.mutate(event.id);
          }}
        />
      )}
      {mine === undefined && !open && (
        <AppText variant="muted">Sign-ups for this cleanup are closed.</AppText>
      )}
      {mine !== undefined && (
        <>
          <AppText accessibilityLiveRegion="polite">
            {mine.status === 'confirmed'
              ? 'You are signed up. See you on the beach!'
              : 'You are on the waiting list. You get a spot if someone cancels.'}
          </AppText>
          <Button
            label={cancel.isPending ? 'Cancelling…' : 'Cancel my sign-up'}
            disabled={cancel.isPending}
            onPress={() => {
              signUp.reset();
              cancel.mutate(mine.id);
            }}
          />
        </>
      )}
      {waiting && (
        <AppText variant="muted" accessibilityLiveRegion="polite">
          No connection: this is sent when you are back online.
        </AppText>
      )}
      {error !== null && (
        <AppText variant="error" accessibilityRole="alert">
          {describeError(error)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.sm,
  },
});
