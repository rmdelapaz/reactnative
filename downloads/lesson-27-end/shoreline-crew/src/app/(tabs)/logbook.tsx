import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutLeft,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';

import { describeError } from '@/api/client';
import { bringInSentLogsMutation } from '@/api/mutations';
import { logbookQuery, viewerId } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { PhotoStrip } from '@/components/PhotoStrip';
import { Screen } from '@/components/Screen';
import { ShareLogbook } from '@/components/ShareLogbook';
import { SwipeToRemove } from '@/components/SwipeToRemove';
import { Tally } from '@/components/Tally';
import { useSession } from '@/hooks/useSession';
import { createThemedStyles } from '@/hooks/useTheme';
import { type QueuedLog, useLogQueue } from '@/state/logQueue';
import { sendWaitingLogs } from '@/state/sendLogs';
import type { LogbookEntry, LogbookTotals } from '@/storage/logbook';
import { radius, spacing } from '@/theme/spacing';
import { formatDate } from '@/utils/format';
import { forgetPhoto } from '@/utils/photoFiles';

// The logbook: the debris logs you sent, kept in a database on this phone. It opens with no signal.
export default function LogbookScreen() {
  const session = useSession();

  if (session === null) {
    return (
      <Screen scroll edges={['left', 'right']}>
        <AppText variant="heading" accessibilityRole="header">
          Sign in to keep a logbook
        </AppText>
        <AppText>
          Your logbook keeps the debris logs you send from cleanups on this phone: what you
          collected, bag by bag, even with no signal.
        </AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }
  // A component of its own: signing out unmounts it, so on a shared phone the next person starts
  // with a fresh screen (not the last person's "Done" line)
  return <MyLogbook viewer={viewerId(session)} />;
}

function MyLogbook({ viewer }: { viewer: string }) {
  const logbook = useQuery(logbookQuery(viewer));
  const bringIn = useMutation(bringInSentLogsMutation(viewer));
  // This volunteer's logs that are not on the server yet. filter makes a new array every time:
  // useShallow compares the items instead, as in the web course
  const queued = useLogQueue(
    useShallow((state) => state.logs.filter((item) => item.volunteerId === viewer)),
  );
  const sending = useLogQueue((state) => state.sending);
  const removeLog = useLogQueue((state) => state.remove);
  // The log the volunteer asked to remove (a swipe or the Remove button): its card asks first
  const [asking, setAsking] = useState<string | null>(null);
  const styles = useStyles();

  if (logbook.data === undefined) {
    return (
      <Screen edges={['left', 'right']}>
        {logbook.isError ? (
          <ErrorView message={describeError(logbook.error)} onRetry={() => logbook.refetch()} />
        ) : (
          <LoadingView label="Opening your logbook…" />
        )}
      </Screen>
    );
  }

  const { entries, totals } = logbook.data;

  function entry(item: LogbookEntry) {
    return (
      // A log that just arrived fades in; the others glide down to make room
      <Animated.View
        key={item.clientId}
        style={styles.card}
        entering={FadeIn}
        layout={LinearTransition}
      >
        <AppText variant="heading">{item.eventTitle}</AppText>
        <AppText variant="muted">{formatDate(item.eventDate)}</AppText>
        <AppText>{amounts(item)}</AppText>
        {item.note !== '' && <AppText variant="muted">{item.note}</AppText>}
      </Animated.View>
    );
  }

  function waitingEntry(item: QueuedLog) {
    const { event, log } = item;
    const pieces = log.items.reduce((sum, { count }) => sum + count, 0);
    return (
      // A card that leaves slides out the way the swipe points; the cards below glide up
      <Animated.View
        key={log.clientId}
        entering={FadeIn}
        exiting={FadeOutLeft}
        layout={LinearTransition}
      >
        {/* Swipe left to ask; never while the queue is sending (it may be sending this log) */}
        <SwipeToRemove enabled={!sending} onSwipe={() => setAsking(log.clientId)}>
          <View style={styles.card}>
            <AppText variant="heading">{event.title}</AppText>
            <AppText variant="muted">{formatDate(event.date)}</AppText>
            <AppText>{amounts({ pieces, bags: log.bags, weightKg: log.weightKg })}</AppText>
            <PhotoStrip photos={item.photos} />
            {item.status === 'waiting' ? (
              <AppText variant="muted">
                Waiting to be sent{item.attempts > 0 && ` (tries so far: ${item.attempts})`}
              </AppText>
            ) : (
              <AppText variant="error">Not sent: {item.problem}</AppText>
            )}
            {asking === log.clientId ? (
              // The log is not on the server: once removed, it is gone. So the card asks first.
              <>
                <AppText accessibilityLiveRegion="polite">
                  Remove this log from your phone? It is not on the server, so it cannot be brought
                  back.
                </AppText>
                <View style={styles.choices}>
                  <Button
                    label="Yes, remove it"
                    variant="primary"
                    disabled={sending}
                    onPress={() => {
                      setAsking(null);
                      removeLog(log.clientId);
                      item.photos.forEach((photo) => forgetPhoto(photo.uri)); // its photos go too
                    }}
                  />
                  <Button label="Keep it" onPress={() => setAsking(null)} />
                </View>
              </>
            ) : (
              // The way to remove a log without a swipe: for every finger, mouse, keyboard and
              // screen reader
              <Button
                label="Remove"
                accessibilityLabel={`Remove the log for ${event.title}`}
                disabled={sending}
                onPress={() => setAsking(log.clientId)}
              />
            )}
          </View>
        </SwipeToRemove>
      </Animated.View>
    );
  }

  const waitingCount = queued.filter((item) => item.status === 'waiting').length;

  return (
    <Screen scroll edges={['left', 'right']}>
      {/* What is here when the Logbook opens is not news: only later arrivals animate in */}
      <LayoutAnimationConfig skipEntering>
        {queued.length > 0 && (
          // The queue. When it empties, it fades out, and the logbook below glides up
          <Animated.View style={styles.section} exiting={FadeOut}>
            <AppText variant="heading" accessibilityRole="header">
              Not sent yet
            </AppText>
            {(sending || waitingCount > 0) && (
              <AppText accessibilityLiveRegion="polite">
                {sending
                  ? 'Sending…'
                  : 'Saved on this phone. Waiting logs go to the server by themselves ' +
                    'when you are back online.'}
              </AppText>
            )}
            {queued.map(waitingEntry)}
            {waitingCount > 0 && (
              // Below the cards, so it moves when they do: it glides too
              <Animated.View layout={LinearTransition}>
                <Button
                  label="Send now"
                  disabled={sending}
                  onPress={() => sendWaitingLogs(viewer)}
                />
              </Animated.View>
            )}
          </Animated.View>
        )}
        <Animated.View style={styles.section} layout={LinearTransition}>
          <AppText variant="heading" accessibilityRole="header">
            {entries.length === 0 ? 'Your logbook is empty' : 'Your logbook'}
          </AppText>
          {entries.length === 0 ? (
            <AppText>
              At a cleanup, you will record what the crew collected: counts, bags and weight.
              Every log you send is kept here, on this phone.
            </AppText>
          ) : (
            <View style={styles.tallies}>
              <Tally value={totals.logs} label={totals.logs === 1 ? 'log' : 'logs'} />
              <Tally value={totals.pieces} label={totals.pieces === 1 ? 'piece' : 'pieces'} />
              <Tally value={totals.bags} label={totals.bags === 1 ? 'bag' : 'bags'} />
              <Tally value={tenths(totals.weightKg)} label="kg" decimals={1} />
            </View>
          )}
          {entries.length > 0 && <ShareLogbook entries={entries} />}
          {entries.map(entry)}
          <AppText variant="heading" accessibilityRole="header">
            Logs from before
          </AppText>
          <AppText>Logs you sent earlier, or from another phone, are on the server.</AppText>
          <Button
            label={bringIn.isPending ? 'Bringing in…' : 'Bring in my sent logs'}
            disabled={bringIn.isPending}
            onPress={() => bringIn.mutate()}
          />
          {bringIn.isPaused && (
            <AppText variant="muted" accessibilityLiveRegion="polite">
              No connection: your logs come in when you are back online.
            </AppText>
          )}
          {bringIn.isSuccess && (
            <AppText variant="muted" accessibilityLiveRegion="polite">
              Done: the server has {bringIn.data} {bringIn.data === 1 ? 'log' : 'logs'} of yours,
              and your logbook has them all.
            </AppText>
          )}
          {bringIn.isError && (
            <AppText variant="error" accessibilityRole="alert">
              {describeError(bringIn.error)}
            </AppText>
          )}
        </Animated.View>
      </LayoutAnimationConfig>
    </Screen>
  );
}

// "42 pieces, 1 bag, 2.5 kg" for one log or for the totals
function amounts({ pieces, bags, weightKg }: Pick<LogbookTotals, 'pieces' | 'bags' | 'weightKg'>) {
  const weight = tenths(weightKg);
  const words = [pieces === 1 ? 'piece' : 'pieces', bags === 1 ? 'bag' : 'bags'];
  return `${pieces} ${words[0]}, ${bags} ${words[1]}, ${weight} kg`;
}

// Kilograms to one decimal: sums of decimals can end in ...0000001
function tenths(kg: number) {
  return Math.round(kg * 10) / 10;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  section: {
    gap: spacing.md, // the same gap as the Screen around it
  },
  tallies: {
    flexDirection: 'row',
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
  choices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
}));
