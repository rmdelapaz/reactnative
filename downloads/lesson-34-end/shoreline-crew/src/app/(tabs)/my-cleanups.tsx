import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { describeError, type MySignup } from '@/api/client';
import { cancelSignupMutation } from '@/api/mutations';
import { mySignupsQuery, viewerId } from '@/api/queries';
import { useSignInEnded } from '@/auth/ended';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/hooks/useSession';
import { createThemedStyles } from '@/hooks/useTheme';
import { radius, spacing } from '@/theme/spacing';
import { formatDate, toDateString } from '@/utils/format';

// My cleanups: the cleanups you signed up for, from GET /api/me/signups, with a way to cancel
export default function MyCleanupsScreen() {
  const session = useSession();
  const ended = useSignInEnded();
  const signups = useQuery({ ...mySignupsQuery(viewerId(session)), enabled: session !== null });
  const cancel = useMutation(cancelSignupMutation());
  // Coming back to this tab asks again: an organizer may have moved you off the waiting list
  useRefreshOnFocus('signups');
  const styles = useStyles();

  if (session === null) {
    return (
      <Screen scroll edges={['left', 'right']}>
        <AppText variant="heading" accessibilityRole="header">
          Sign in to see your cleanups
        </AppText>
        {ended && (
          <AppText variant="error" accessibilityRole="alert">
            Your sign-in has ended. Sign in again.
          </AppText>
        )}
        <AppText>
          The cleanups you sign up for are listed here, with your place on the waiting list if one
          is full.
        </AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }

  if (signups.data === undefined) {
    return (
      <Screen edges={['left', 'right']}>
        {signups.isError && !signups.isRefetching ? (
          <ErrorView message={describeError(signups.error)} onRetry={() => signups.refetch()} />
        ) : (
          <LoadingView label="Loading your cleanups…" />
        )}
      </Screen>
    );
  }

  const today = toDateString(new Date());
  // Spots you hold or wait for, soonest first (the API lists the latest cleanup first), and
  // today's cleanup once you have checked in: it is still going on
  const comingUp = signups.data
    .filter(
      ({ status, event }) =>
        ((status === 'confirmed' || status === 'waitlisted') && event.date >= today) ||
        (status === 'attended' && event.date === today),
    )
    .reverse();
  const helped = signups.data.filter(({ status }) => status === 'attended').length;

  function row(signup: MySignup) {
    const { event } = signup;
    // This row's cancel is the one on its way
    const cancelling = cancel.isPending && cancel.variables === signup.id;
    return (
      <View key={signup.id} style={styles.card}>
        <AppText variant="heading">{event.title}</AppText>
        <AppText variant="muted">
          {formatDate(event.date)}, {event.startTime} to {event.endTime}
        </AppText>
        <View style={styles.row}>
          {signup.status === 'attended' ? (
            <Badge label="Checked in" tone="success" />
          ) : signup.status === 'confirmed' ? (
            <Badge label="Signed up" tone="success" />
          ) : (
            <Badge label="Waiting list" tone="attention" />
          )}
        </View>
        <View style={styles.row}>
          <Link href={{ pathname: '/cleanups/[id]', params: { id: event.id } }} asChild>
            <Button label="Open" variant="primary" accessibilityLabel={`Open ${event.title}`} />
          </Link>
          {/* Checked in: there is nothing left to cancel (the same rule as SignupPanel) */}
          {signup.status !== 'attended' && (
            <Button
              label={cancelling ? 'Cancelling…' : 'Cancel'}
              accessibilityLabel={`Cancel my sign-up for ${event.title}`}
              disabled={cancel.isPending}
              onPress={() => cancel.mutate(signup.id)}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    // The header bar covers the top and the tab bar the bottom: only the sides are left
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        {comingUp.length === 0 ? 'No sign-ups yet' : 'Coming up'}
      </AppText>
      {comingUp.length === 0 && (
        <AppText>When you sign up for a cleanup, it is listed here.</AppText>
      )}
      {comingUp.map(row)}
      {cancel.isPaused && (
        <AppText variant="muted" accessibilityLiveRegion="polite">
          No connection: your cancellation is sent when you are back online.
        </AppText>
      )}
      {cancel.isError && (
        <AppText variant="error" accessibilityRole="alert">
          {describeError(cancel.error)}
        </AppText>
      )}
      {helped > 0 && (
        <AppText variant="muted">
          You have helped at {helped} {helped === 1 ? 'cleanup' : 'cleanups'}. Thank you!
        </AppText>
      )}
      {/* "/" is the Cleanups tab: a link to a tab's address switches to that tab */}
      <Link href="/" asChild>
        <Button label="Find a cleanup" />
      </Link>
    </Screen>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
}));
