import { useQuery } from '@tanstack/react-query';
import { Link, Stack, useLocalSearchParams } from 'expo-router';

import { ApiError, describeError } from '@/api/client';
import { stopQuery } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { changeMyStop, useMyStop } from '@/state/myStop';
import { scheduleLabel } from '@/utils/schedule';

// TODO R1b (done). One stop, opened from the list or by a link (bookmobilestops://stops/s03).
// The id comes from the address: always a string, maybe a wrong one (Lesson 4.1).
export default function StopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const stop = useQuery(stopQuery(id));
  const myStopId = useMyStop();

  if (stop.isPending) {
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        <LoadingView label="Loading the stop…" />
      </Screen>
    );
  }
  if (stop.isError) {
    const notFound = stop.error instanceof ApiError && stop.error.status === 404;
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        {notFound ? (
          <>
            <AppText accessibilityRole="alert">No stop with that id. Check the link.</AppText>
            <Link href="/" asChild>
              <Button label="See all stops" variant="primary" />
            </Link>
          </>
        ) : (
          <ErrorView message={describeError(stop.error)} onRetry={() => stop.refetch()} />
        )}
      </Screen>
    );
  }
  const isMine = stop.data.id === myStopId;
  return (
    <Screen edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: stop.data.name }} />
      <AppText variant="title" accessibilityRole="header">
        {stop.data.name}
      </AppText>
      <AppText>When: {scheduleLabel(stop.data)}</AppText>
      <AppText>Where: {stop.data.address}</AppText>
      {isMine ? (
        <>
          <Badge label="My stop" tone="attention" />
          <AppText>This is your stop.</AppText>
        </>
      ) : (
        <Button label="Make this my stop" variant="primary" onPress={() => changeMyStop(stop.data.id)} />
      )}
    </Screen>
  );
}
