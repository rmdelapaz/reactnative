import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { RefreshControl } from 'react-native';

import { describeError } from '@/api/client';
import { stopsQuery } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { NearestStop } from '@/components/NearestStop';
import { Screen } from '@/components/Screen';
import { StopCard } from '@/components/StopCard';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useMyStop } from '@/state/myStop';

// TODO R3b (done). The Stops tab: where and when the van stops this week, with every face a
// request can have (loading, error, empty, the list) and pull to refresh (Lesson 5.2).
export default function StopsScreen() {
  const stops = useQuery(stopsQuery());
  const myStopId = useMyStop();
  const [refreshing, setRefreshing] = useState(false);
  useRefreshOnFocus('stops');

  async function refresh() {
    setRefreshing(true);
    await stops.refetch();
    setRefreshing(false);
  }

  if (stops.isPending) {
    return (
      <Screen>
        <LoadingView label="Loading stops…" />
      </Screen>
    );
  }
  if (stops.isError) {
    return (
      <Screen>
        <ErrorView message={describeError(stops.error)} onRetry={() => stops.refetch()} />
      </Screen>
    );
  }
  return (
    <Screen refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      {stops.data.length === 0 ? (
        <EmptyState message="No stops are scheduled this week." action={{ label: 'Refresh', onPress: refresh }} />
      ) : (
        <>
          <NearestStop stops={stops.data} />
          <AppText variant="muted" accessibilityLiveRegion="polite">
            {stops.data.length === 1 ? '1 stop this week' : `${stops.data.length} stops this week`}
          </AppText>
          {/* A button too: the web preview and a mouse have no pull gesture */}
          <Button label="Refresh" onPress={refresh} disabled={refreshing} />
          {stops.data.map((stop) => (
            <StopCard key={stop.id} stop={stop} isMyStop={stop.id === myStopId} />
          ))}
        </>
      )}
    </Screen>
  );
}
