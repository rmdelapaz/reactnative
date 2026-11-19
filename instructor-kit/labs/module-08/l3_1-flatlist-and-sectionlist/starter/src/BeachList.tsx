import { useState } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Load, Site } from './types';

type BeachListProps = {
  load: Load;
  // 1 on a phone, 2 on a wider screen (Lesson 2.5's useColumns gives this number)
  columns: number;
  onRetry: () => void;
};

// The six beaches as a list: a search field above them, one or two columns
export function BeachList({ load, columns, onRetry }: BeachListProps) {
  const [query, setQuery] = useState('');
  const sites =
    load.status === 'loaded'
      ? load.sites.filter((site) => site.name.toLowerCase().includes(query.trim().toLowerCase()))
      : [];

  const renderSite = ({ item }: ListRenderItemInfo<Site>) => (
    <View style={[styles.cell, { width: `${100 / columns}%` }]}>
      <Text accessibilityRole="header" style={styles.name}>
        {item.name}
      </Text>
      <Text>{item.town}</Text>
    </View>
  );

  // TODO 2: what the list shows when it has no beaches (import the three from './states'): Loading with
  // "Loading beaches…" while loading, Failed with the message and onRetry after a failure, and Empty ("No beaches match your search.", with a
  // "Show all beaches" action that clears the search) when nothing matches. Put it in ListEmptyComponent.

  return (
    <FlatList
      data={sites}
      keyExtractor={(site) => site.id}
      renderItem={renderSite}
      numColumns={columns}
      // TODO 1: two bugs in this list (read the two Task 1 failures from the top)
      ListHeaderComponent={() => (
        <View style={styles.header}>
          <TextInput
            accessibilityLabel="Search beaches"
            placeholder="Search beaches"
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, paddingBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  cell: { paddingVertical: 8, paddingHorizontal: 4 },
  name: { fontSize: 18, fontWeight: '600' },
});
