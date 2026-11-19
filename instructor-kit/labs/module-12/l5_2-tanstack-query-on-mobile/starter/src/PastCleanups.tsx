// The past cleanups, a page at a time, with a Load more button (given: nothing to change here)
import { useInfiniteQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { pastCleanupsQuery } from './queries';

export function PastCleanups({ base }: { base: string }) {
  const past = useInfiniteQuery(pastCleanupsQuery(base));

  if (past.data === undefined) {
    if (past.fetchStatus === 'paused') {
      return <Text>Waiting for a connection…</Text>;
    }
    if (past.isError) {
      return <Text accessibilityRole="alert">Could not load the past cleanups.</Text>;
    }
    return <Text>Loading past cleanups…</Text>;
  }

  const cleanups = past.data.pages.flatMap((page) => page.items);
  const total = past.data.pages[past.data.pages.length - 1].total;

  function loadMore() {
    // Ask only when idle (Lesson 3.2): never a second request while one is on its way
    if (past.hasNextPage && !past.isFetching) {
      past.fetchNextPage();
    }
  }

  return (
    <View style={styles.list}>
      <Text accessibilityRole="header">
        Showing {cleanups.length} of {total} past cleanups
      </Text>
      {cleanups.map((cleanup) => (
        <Text key={cleanup.id}>{cleanup.title}</Text>
      ))}
      {past.hasNextPage && (
        <Pressable accessibilityRole="button" onPress={loadMore} style={styles.button}>
          <Text>{past.isFetchingNextPage ? 'Loading…' : 'Load more'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
    padding: 16,
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
  },
});
