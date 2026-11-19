import { useMutation, useQuery } from '@tanstack/react-query';
import { router, Stack, useLocalSearchParams } from 'expo-router';

import { ApiError, describeError } from '@/api/client';
import { changeStatusMutation } from '@/api/mutations';
import { itemQuery } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { LoadingView } from '@/components/LoadingView';
import { Screen } from '@/components/Screen';
import { formatDate } from '@/utils/format';
import { itemStatusLabels } from '@/utils/labels';

// Back where people came from, or to the list when there is nothing underneath (a link opened it)
function leave() {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/');
  }
}

// One item: its own address (/items/i3), so a link can open it (Lesson 4.4)
export default function ItemScreen() {
  const { id } = useLocalSearchParams<'/items/[id]'>();
  const item = useQuery(itemQuery(id));
  const change = useMutation(changeStatusMutation(id));

  if (item.isPending) {
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        <LoadingView label="Loading the item…" />
      </Screen>
    );
  }
  if (item.isError) {
    const missing = item.error instanceof ApiError && item.error.status === 404;
    return (
      <Screen edges={['bottom', 'left', 'right']}>
        {missing ? (
          <EmptyState
            message="This item is not here any more. It may have been deleted."
            action={{ label: 'Back to the list', onPress: leave }}
          />
        ) : (
          <ErrorView message={describeError(item.error)} onRetry={() => item.refetch()} />
        )}
      </Screen>
    );
  }

  const { name, note, status, createdAt } = item.data;
  const next = status === 'open' ? 'done' : 'open';
  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: name }} />
      <AppText variant="title" accessibilityRole="header">
        {name}
      </AppText>
      <AppText>Status: {itemStatusLabels[status]}</AppText>
      <AppText variant="muted">Added {formatDate(createdAt)}</AppText>
      <AppText>{note ?? 'No note.'}</AppText>
      {change.isError && (
        <AppText variant="error" accessibilityRole="alert">
          {describeError(change.error)}
        </AppText>
      )}
      <Button
        label={change.isPending ? 'Saving…' : next === 'done' ? 'Mark as done' : 'Open it again'}
        variant="primary"
        disabled={change.isPending}
        onPress={() => change.mutate(next)}
      />
    </Screen>
  );
}
