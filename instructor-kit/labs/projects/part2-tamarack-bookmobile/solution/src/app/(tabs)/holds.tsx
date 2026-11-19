import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { RefreshControl } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { describeError, type Session } from '@/api/client';
import { holdsQuery, viewerId } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useSession } from '@/hooks/useSession';
import { useHoldQueue } from '@/state/holdQueue';
import { sendWaitingHolds } from '@/state/sendHolds';

// TODO R2b (done). The Holds tab: two faces. A guest is asked to sign in (Lesson 4.3: the screen
// is kindness, the API's 401 is the rule); a signed-in patron sees the holds still on this phone
// and the holds the library has.
export default function HoldsScreen() {
  const session = useSession();
  if (session === null) {
    return (
      <Screen>
        <AppText>Sign in to see and place holds.</AppText>
        <Link href="/sign-in" asChild>
          <Button label="Sign in" variant="primary" />
        </Link>
      </Screen>
    );
  }
  return <MyHolds session={session} />;
}

function MyHolds({ session }: { session: Session }) {
  const patronId = session.patron.id;
  const holds = useQuery(holdsQuery(viewerId(session)));
  // A list from the store: useShallow, or every render makes a "new" list (Lesson 5.5)
  const queued = useHoldQueue(useShallow((state) => state.holds.filter((hold) => hold.patronId === patronId)));
  const remove = useHoldQueue((state) => state.remove);
  const [refreshing, setRefreshing] = useState(false);
  useRefreshOnFocus('holds');

  async function refresh() {
    setRefreshing(true);
    await sendWaitingHolds(patronId);
    await holds.refetch();
    setRefreshing(false);
  }

  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      {queued.length > 0 && (
        <AppText variant="heading" accessibilityRole="header">
          On this phone
        </AppText>
      )}
      {queued.map((hold) => (
        <Card key={hold.clientId}>
          <AppText variant="heading">{hold.bookTitle}</AppText>
          <AppText>Pick up at {hold.stopName}</AppText>
          {hold.status === 'waiting' ? (
            <>
              <Badge label="Not sent yet" tone="attention" />
              <AppText variant="muted">Saved on this phone. It is sent as soon as you are online.</AppText>
            </>
          ) : (
            <>
              <AppText variant="error">{hold.problem}</AppText>
              <Button label="Remove" accessibilityLabel={`Remove ${hold.bookTitle}`} onPress={() => remove(hold.clientId)} />
            </>
          )}
        </Card>
      ))}
      {queued.some((hold) => hold.status === 'waiting') && (
        <Button label="Send now" variant="primary" onPress={() => sendWaitingHolds(patronId)} />
      )}
      <AppText variant="heading" accessibilityRole="header">
        Your holds
      </AppText>
      {holds.isPending ? (
        <LoadingView label="Loading your holds…" />
      ) : holds.isError ? (
        <ErrorView message={describeError(holds.error)} onRetry={() => holds.refetch()} />
      ) : holds.data.length === 0 ? (
        <EmptyState message="You have no holds yet. Find a book on the Books tab." />
      ) : (
        holds.data.map((hold) => (
          <Card key={hold.id}>
            <AppText variant="heading">{hold.bookTitle}</AppText>
            <AppText>Pick up at {hold.stopName}</AppText>
            {hold.status === 'ready' ? (
              <Badge label="Ready at the stop" tone="success" />
            ) : (
              <Badge label="Requested" tone="info" />
            )}
          </Card>
        ))
      )}
    </Screen>
  );
}
