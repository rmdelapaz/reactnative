import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { describeError } from '@/api/client';
import { mySignupsQuery, viewerId } from '@/api/queries';
import { type DebrisLogValues, debrisLogSchema, toNewLog } from '@/api/schemas';
import type { CleanupEvent, NewCleanupLog } from '@/api/types';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ControlledField } from '@/components/ControlledField';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { FormScreen } from '@/components/FormScreen';
import { LoadingView } from '@/components/LoadingView';
import { LogPhotos } from '@/components/LogPhotos';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { useSession } from '@/hooks/useSession';
import { type LogPhoto, type QueuedLog, useLogQueue } from '@/state/logQueue';
import { sendWaitingLogs } from '@/state/sendLogs';
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
  return <DebrisLogForm event={held.event} viewer={viewer} />;
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

function DebrisLogForm({ event, viewer }: { event: CleanupEvent; viewer: string }) {
  // One id per log, made on the phone the moment the form opens: if the same log is sent twice
  // (a retry after a lost answer), the API recognizes it and keeps one
  const [clientId] = useState(() => randomUUID());
  // The log handed to the queue (null until Send), and what the queue knows about it now
  const [handedOver, setHandedOver] = useState<NewCleanupLog | null>(null);
  // The photos are files, not typed text: plain state next to the form, not a form field
  const [photos, setPhotos] = useState<LogPhoto[]>([]);
  const queued = useLogQueue((state) => state.logs.find((item) => item.log.clientId === clientId));
  const sending = useLogQueue((state) => state.sending);
  const addLog = useLogQueue((state) => state.add);
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

  // Checked by the schema first; the time is when Send was pressed, not when the form opened.
  // The log goes into the queue (saved on the phone at once), and the queue sends it if it can.
  const send = handleSubmit((data) => {
    const log = toNewLog(data, clientId, new Date());
    addLog(viewer, { event, log }, photos);
    setHandedOver(log);
    void sendWaitingLogs(viewer);
  });

  if (handedOver !== null) {
    return (
      <LogHandedOver
        event={event}
        log={handedOver}
        photoCount={photos.length}
        queued={queued}
        sending={sending}
      />
    );
  }

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
      <LogPhotos photos={photos} onChange={setPhotos} />
      {errors.root !== undefined && (
        <AppText variant="error" accessibilityRole="alert">
          {errors.root.message}
        </AppText>
      )}
      <Button label="Send the log" variant="primary" onPress={() => send()} />
    </FormScreen>
  );
}

type HandedOverProps = {
  event: CleanupEvent;
  log: NewCleanupLog;
  photoCount: number;
  queued: QueuedLog | undefined; // undefined: it has left the queue, so the server has it
  sending: boolean;
};

// After Send: sent, still waiting (saved on the phone), or refused, read from the queue
function LogHandedOver({ event, log, photoCount, queued, sending }: HandedOverProps) {
  const pieces = log.items.reduce((sum, item) => sum + item.count, 0);
  const heading =
    queued === undefined
      ? 'Log sent. Thank you!'
      : queued.status === 'refused'
        ? 'The server did not take this log'
        : sending
          ? 'Sending your log…'
          : 'Saved on this phone';
  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <AppText variant="heading" accessibilityRole="header" accessibilityLiveRegion="polite">
        {heading}
      </AppText>
      <AppText>
        {event.title}: {pieces} {pieces === 1 ? 'piece' : 'pieces'}, {log.bags}{' '}
        {log.bags === 1 ? 'bag' : 'bags'}, {log.weightKg} kg
        {photoCount > 0 && `, ${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`}.
      </AppText>
      {queued === undefined && <AppText>It is in your logbook too.</AppText>}
      {queued?.status === 'waiting' && !sending && (
        <AppText>
          It goes to the server by itself when you are back online, even if you close the app.
          Your logbook shows it as waiting until then.
        </AppText>
      )}
      {queued?.status === 'refused' && (
        <AppText variant="error" accessibilityRole="alert">
          {queued.problem} The log stays in your logbook until you remove it.
        </AppText>
      )}
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
