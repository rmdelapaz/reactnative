import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { describeError } from '@/api/client';
import { bringInSentLogsMutation } from '@/api/mutations';
import { logbookQuery, viewerId } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { useSession } from '@/hooks/useSession';
import { createThemedStyles } from '@/hooks/useTheme';
import type { LogbookEntry, LogbookTotals } from '@/storage/logbook';
import { radius, spacing } from '@/theme/spacing';
import { formatDate } from '@/utils/format';

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
      <View key={item.clientId} style={styles.card}>
        <AppText variant="heading">{item.eventTitle}</AppText>
        <AppText variant="muted">{formatDate(item.eventDate)}</AppText>
        <AppText>{amounts(item)}</AppText>
        {item.note !== '' && <AppText variant="muted">{item.note}</AppText>}
      </View>
    );
  }

  return (
    <Screen scroll edges={['left', 'right']}>
      <AppText variant="heading" accessibilityRole="header">
        {entries.length === 0 ? 'Your logbook is empty' : 'Your logbook'}
      </AppText>
      {entries.length === 0 ? (
        <AppText>
          At a cleanup, you will record what the crew collected: counts, bags and weight. Every log
          you send is kept here, on this phone.
        </AppText>
      ) : (
        <AppText>
          {totals.logs} {totals.logs === 1 ? 'log' : 'logs'} in all: {amounts(totals)}.
        </AppText>
      )}
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
          Done: the server has {bringIn.data} {bringIn.data === 1 ? 'log' : 'logs'} of yours, and
          your logbook has them all.
        </AppText>
      )}
      {bringIn.isError && (
        <AppText variant="error" accessibilityRole="alert">
          {describeError(bringIn.error)}
        </AppText>
      )}
    </Screen>
  );
}

// "42 pieces, 1 bag, 2.5 kg" for one log or for the totals
function amounts({ pieces, bags, weightKg }: Pick<LogbookTotals, 'pieces' | 'bags' | 'weightKg'>) {
  const weight = Math.round(weightKg * 10) / 10; // sums of decimals can end in ...0000001
  const words = [pieces === 1 ? 'piece' : 'pieces', bags === 1 ? 'bag' : 'bags'];
  return `${pieces} ${words[0]}, ${bags} ${words[1]}, ${weight} kg`;
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
  },
}));
