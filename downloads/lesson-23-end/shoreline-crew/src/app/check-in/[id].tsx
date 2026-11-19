import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { ApiError, describeError } from '@/api/client';
import { checkInMutation } from '@/api/mutations';
import { mySignupsQuery, viewerId } from '@/api/queries';
import { type CheckInValues, checkInSchema } from '@/api/schemas';
import type { CleanupEvent } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { FormScreen } from '@/components/FormScreen';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { useSession } from '@/hooks/useSession';
import { formatDate, toDateString } from '@/utils/format';

// Back to wherever the check-in was opened from (or to the Cleanups tab after a link)
function leave() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

// Check in at the beach: /check-in/e17 (a modal over the cleanup's screen)
export default function CheckInScreen() {
  const { id } = useLocalSearchParams<'/check-in/[id]'>();
  const session = useSession();

  // Open to everyone, like the debris log: a guest signs in on top, and lands back here
  if (session === null) {
    return (
      <Screen scroll edges={['bottom', 'left', 'right']}>
        <AppText variant="heading" accessibilityRole="header">
          Sign in to check in
        </AppText>
        <AppText>Check-in is for volunteers with a spot at the cleanup.</AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }
  return <CheckInForCleanup id={id} viewer={viewerId(session)} />;
}

// Your sign-up for this cleanup decides the face: the form, "checked in", or why not
function CheckInForCleanup({ id, viewer }: { id: string; viewer: string }) {
  const signups = useQuery(mySignupsQuery(viewer));

  if (signups.data === undefined) {
    return (
      <Screen scroll edges={['bottom', 'left', 'right']}>
        {signups.isError ? (
          <ErrorView message={describeError(signups.error)} onRetry={() => signups.refetch()} />
        ) : (
          <LoadingView label="Checking your sign-ups…" />
        )}
      </Screen>
    );
  }

  const mine = signups.data.find(
    ({ eventId, status }) => eventId === id && status !== 'cancelled',
  );
  if (mine?.status === 'attended') {
    return <CheckedIn event={mine.event} />;
  }
  // The API's own rules, said before anyone types a code
  const message =
    mine === undefined || mine.status !== 'confirmed'
      ? 'You need a confirmed spot to check in.'
      : mine.event.date !== toDateString(new Date())
        ? `Check-in opens on the day of the cleanup: ${formatDate(mine.event.date)}.`
        : null;

  if (mine === undefined || message !== null) {
    return (
      <Screen scroll edges={['bottom', 'left', 'right']}>
        <EmptyState message={message ?? ''} action={{ label: 'Go back', onPress: leave }} />
      </Screen>
    );
  }
  return <CheckInForm event={mine.event} />;
}

function CheckInForm({ event }: { event: CleanupEvent }) {
  const checkInNow = useMutation(checkInMutation(event.id));
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: { code: '' },
    mode: 'onTouched',
  });

  async function submit({ code }: CheckInValues) {
    try {
      // When it works, the sign-ups are fetched again and say 'attended': the screen changes
      // to "You are checked in" by itself
      await checkInNow.mutateAsync(code);
    } catch (error) {
      // 400: a wrong code, with the API's message for the code field
      const forCode = error instanceof ApiError ? error.fieldErrors?.code?.[0] : undefined;
      if (forCode !== undefined) {
        setError('code', { message: forCode }, { shouldFocus: true });
      } else {
        setError('root.server', { message: describeError(error) });
      }
    }
  }
  const send = handleSubmit(submit);

  return (
    <FormScreen>
      <View>
        <AppText variant="heading" accessibilityRole="header">
          {event.title}
        </AppText>
        <AppText variant="muted">Meet at {event.meetingPoint}</AppText>
      </View>
      <AppText>
        At the meeting point, the organizer reads out the code for the day. Type it here to let
        the crew know you are on the beach.
      </AppText>
      <ControlledField
        control={control}
        name="code"
        label="Code for the day"
        inputMode="numeric" // digits only
        maxLength={4}
        autoComplete="off"
        enterKeyHint="go"
        onSubmitEditing={() => send()}
      />
      {checkInNow.isPaused && (
        <AppText variant="muted" accessibilityLiveRegion="polite">
          No connection: your check-in is sent when you are back online. Keep Shoreline Crew open
          until then.
        </AppText>
      )}
      {errors.root?.server !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.server.message}
        </AppText>
      )}
      <Button
        label={isSubmitting ? 'Checking in…' : 'Check in'}
        variant="primary"
        disabled={isSubmitting}
        onPress={() => send()}
      />
    </FormScreen>
  );
}

// Checked in (now, or earlier on this phone or another one)
function CheckedIn({ event }: { event: CleanupEvent }) {
  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header" accessibilityLiveRegion="polite">
        You are checked in
      </AppText>
      <AppText>Thank you for coming to {event.title}. Have a good cleanup!</AppText>
      <Button label="Done" variant="primary" onPress={leave} />
      {/* The next thing a volunteer does on the day: this modal makes way for the log */}
      <Link href={{ pathname: '/log/[id]', params: { id: event.id } }} replace asChild>
        <Button label="Log what you collected" />
      </Link>
    </Screen>
  );
}
