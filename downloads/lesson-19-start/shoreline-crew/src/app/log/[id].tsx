import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { ApiError, describeError } from '@/api/client';
import { sendLogMutation } from '@/api/mutations';
import { mySignupsQuery, viewerId } from '@/api/queries';
import { type DebrisLogValues, debrisLogSchema, toNewLog } from '@/api/schemas';
import type { CleanupEvent, CleanupLog } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { FormScreen } from '@/components/FormScreen';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { useSession } from '@/hooks/useSession';
import { spacing } from '@/theme/spacing';
import { debrisCategories, debrisLabels } from '@/utils/debris';
import { formatDate, toDateString } from '@/utils/format';

// Back to wherever the log was opened from (or to the Cleanups tab after a link)
function leave() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

// A new debris log for the cleanup with this id: /log/e17 (a modal over the cleanup's screen)
export default function LogScreen() {
  const { id } = useLocalSearchParams<'/log/[id]'>();
  const session = useSession();

  // Open to everyone, so a link always lands here: a guest signs in on top of this screen,
  // and the form is waiting underneath when the sign-in closes
  if (session === null) {
    return (
      <Screen scroll edges={['bottom', 'left', 'right']}>
        <AppText variant="heading" accessibilityRole="header">
          Sign in to log what you collected
        </AppText>
        <AppText>Debris logs are for volunteers with a spot at the cleanup.</AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }
  return <LogForCleanup id={id} viewer={viewerId(session)} />;
}

// Signed in: is this your cleanup, and has it happened? Your sign-ups know both.
function LogForCleanup({ id, viewer }: { id: string; viewer: string }) {
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

  // A spot at this cleanup: signed up, or already checked in (the API's own rule)
  const held = signups.data.find(
    ({ eventId, status }) => eventId === id && (status === 'confirmed' || status === 'attended'),
  );
  const message =
    held === undefined
      ? 'Only volunteers with a spot at this cleanup can log for it.'
      : held.event.date > toDateString(new Date())
        ? `This cleanup is on ${formatDate(held.event.date)}. Log what you collected on the day.`
        : null;

  if (held === undefined || message !== null) {
    return (
      <Screen scroll edges={['bottom', 'left', 'right']}>
        <EmptyState message={message ?? ''} action={{ label: 'Go back', onPress: leave }} />
      </Screen>
    );
  }
  return <DebrisLogForm event={held.event} />;
}

// Every kind of debris starts at 0, as text: the fields hold what the volunteer sees
const emptyLog: DebrisLogValues = {
  counts: Object.fromEntries(debrisCategories.map((category) => [category, '0'])) as Record<
    (typeof debrisCategories)[number],
    string
  >,
  bags: '0',
  weightKg: '',
  note: '',
};

function DebrisLogForm({ event }: { event: CleanupEvent }) {
  // One id per log, made on the phone the moment the form opens: if the same log is sent twice
  // (a retry after a lost answer), the API recognizes it and keeps one
  const [clientId] = useState(() => randomUUID());
  const sendLog = useMutation(sendLogMutation());
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(debrisLogSchema),
    defaultValues: emptyLog,
    mode: 'onTouched',
  });

  // Checked by the schema first; the time is when Send was pressed, not when the form opened
  const send = handleSubmit((data) =>
    sendLog.mutate({ event, log: toNewLog(data, clientId, new Date()) }),
  );

  if (sendLog.isSuccess) {
    return <LogSent event={event} log={sendLog.data} />;
  }

  // The server's "no" in its own words (403 no spot, 409 not yet, 400 fields), else the usual text
  const error = sendLog.error;
  const problem =
    error === null
      ? null
      : error instanceof ApiError && error.status >= 400 && error.status < 500 && error.status !== 401
        ? error.message
        : describeError(error);

  return (
    <FormScreen>
      <View>
        <AppText variant="heading" accessibilityRole="header">
          {event.title}
        </AppText>
        <AppText variant="muted">{formatDate(event.date)}</AppText>
      </View>
      <AppText>Count what you picked up. Leave a kind at 0 if you found none.</AppText>
      <View style={styles.group}>
        {debrisCategories.map((category) => (
          <Controller
            key={category}
            control={control}
            name={`counts.${category}`}
            render={({ field: { ref, value, onChange, onBlur }, fieldState }) => (
              <Stepper
                ref={ref}
                label={debrisLabels[category]}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                max={100_000}
                error={fieldState.error?.message}
              />
            )}
          />
        ))}
      </View>
      <Controller
        control={control}
        name="bags"
        render={({ field: { ref, value, onChange, onBlur }, fieldState }) => (
          <Stepper
            ref={ref}
            label="Bags filled"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            max={500}
            error={fieldState.error?.message}
          />
        )}
      />
      <ControlledField
        control={control}
        name="weightKg"
        label="Weight (kg)"
        placeholder="For example 2.5"
        inputMode="decimal" // numbers and a decimal point (or comma)
        enterKeyHint="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('note')}
      />
      <ControlledField
        control={control}
        name="note"
        label="Note (optional)"
        multiline // the return key starts a new line here
        maxLength={500}
        autoCapitalize="sentences"
      />
      {errors.root !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.message}
        </AppText>
      )}
      {sendLog.isPaused && (
        <AppText variant="muted" accessibilityLiveRegion="polite">
          No connection: your log is sent when you are back online. Keep the app open until then.
        </AppText>
      )}
      {problem !== null && (
        <AppText variant="error" accessibilityRole="alert">
          Not sent. {problem}
        </AppText>
      )}
      <Button
        label={sendLog.isPending ? 'Sending…' : 'Send the log'}
        variant="primary"
        disabled={sendLog.isPending}
        onPress={() => send()}
      />
    </FormScreen>
  );
}

// After a 201 (or a 200 for a resend): what the server saved, and where to see it
function LogSent({ event, log }: { event: CleanupEvent; log: CleanupLog }) {
  const pieces = log.items.reduce((sum, item) => sum + item.count, 0);
  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        Log sent. Thank you!
      </AppText>
      <AppText accessibilityLiveRegion="polite">
        {event.title}: {pieces} {pieces === 1 ? 'piece' : 'pieces'}, {log.bags}{' '}
        {log.bags === 1 ? 'bag' : 'bags'}, {log.weightKg} kg. It is in your logbook too.
      </AppText>
      <Button label="Done" variant="primary" onPress={leave} />
      <Link href="/logbook" dismissTo asChild>
        <Button label="Open my logbook" />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.md,
  },
});
