import { useState } from 'react';
import { FlatList, type ListRenderItemInfo, StyleSheet, Text, TextInput, View } from 'react-native';

import { Empty, Failed, Loading } from './states';
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

  // Above the beaches, in every state. An element, not a component: the field keeps its text and its focus.
  const header = (
    <View style={styles.header}>
      <TextInput
        accessibilityLabel="Search beaches"
        placeholder="Search beaches"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
    </View>
  );

  // What the list shows when it has no beaches: still loading, a failed load, or nothing matches
  const empty =
    load.status === 'loading' ? (
      <Loading label="Loading beaches…" />
    ) : load.status === 'failed' ? (
      <Failed message={load.message} onRetry={onRetry} />
    ) : (
      <Empty message="No beaches match your search." action={{ label: 'Show all beaches', onPress: () => setQuery('') }} />
    );

  return (
    <FlatList
      // A FlatList cannot change its number of columns: a new key makes React build a new one
      key={columns}
      data={sites}
      keyExtractor={(site) => site.id}
      renderItem={renderSite}
      numColumns={columns}
      ListHeaderComponent={header}
      ListEmptyComponent={empty}
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, paddingBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  cell: { paddingVertical: 8, paddingHorizontal: 4 },
  name: { fontSize: 18, fontWeight: '600' },
});
