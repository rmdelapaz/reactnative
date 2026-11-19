import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { describeError } from '@/api/client';
import { itemsQuery } from '@/api/queries';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErrorView } from '@/components/ErrorView';
import { ItemRow } from '@/components/ItemRow';
import { LoadingView } from '@/components/LoadingView';
import { useScreenScroll } from '@/components/Screen';
import { SourceNote } from '@/components/SourceNote';
import { spacing } from '@/theme/spacing';

// The starter's example list: loading, failed, empty and loaded states, pull to refresh, a row
// per item that opens its screen, and a way to add one. Milestone 2 replaces it with your own.
export default function ItemsScreen() {
  // Under a header: the top edge is the header's (Lesson 2.3)
  const screen = useScreenScroll(['bottom', 'left', 'right']);
  const items = useQuery(itemsQuery());
  // Pull to refresh shows its own spinner only for a pull, not for every background refetch
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    await items.refetch();
    setRefreshing(false);
  }

  const count = items.data?.length ?? 0;
  const header = (
    <View style={styles.header}>
      <SourceNote />
      <View style={styles.titleRow}>
        <AppText variant="heading" accessibilityRole="header" style={styles.title}>
          {items.isSuccess ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Items'}
        </AppText>
        <Link href="/new-item" asChild>
          <Button label="New item" variant="primary" />
        </Link>
      </View>
    </View>
  );

  return (
    <FlatList
      {...screen}
      data={items.data ?? []}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ItemRow item={item} />}
      ItemSeparatorComponent={Gap}
      ListHeaderComponent={header}
      ListEmptyComponent={
        items.isPending ? (
          <LoadingView label="Loading items…" />
        ) : items.isError ? (
          <ErrorView message={describeError(items.error)} onRetry={() => items.refetch()} />
        ) : (
          <EmptyState message="No items yet. Add the first one." />
        )
      }
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}

function Gap() {
  return <View style={styles.gap} />;
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1, // takes the room the button leaves, and wraps inside it
  },
  gap: {
    height: spacing.sm,
  },
});
