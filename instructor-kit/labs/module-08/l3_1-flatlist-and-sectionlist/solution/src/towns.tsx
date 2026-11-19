import { SectionList, StyleSheet, Text } from 'react-native';

import type { Site } from './types';

// One town and its beaches: the shape SectionList wants
export type TownSection = { title: string; data: Site[] };

// The beaches under their towns, the towns in alphabetical order, each town's beaches in the order given
export function groupByTown(sites: Site[]): TownSection[] {
  const towns = [...new Set(sites.map((site) => site.town))].sort();
  return towns.map((town) => ({ title: town, data: sites.filter((site) => site.town === town) }));
}

// The beaches under their towns, with the current town's heading pinned at the top
export function TownList({ sites }: { sites: Site[] }) {
  return (
    <SectionList
      sections={groupByTown(sites)}
      keyExtractor={(site) => site.id}
      renderItem={({ item }) => <Text style={styles.beach}>{item.name}</Text>}
      renderSectionHeader={({ section }) => (
        <Text accessibilityRole="header" style={styles.town}>
          {section.title}
        </Text>
      )}
      // React Native turns it on for iOS only: say it, to get the same list everywhere
      stickySectionHeadersEnabled
    />
  );
}

export const styles = StyleSheet.create({
  town: { backgroundColor: '#fbf6ec', fontSize: 20, fontWeight: '700', paddingVertical: 4 },
  beach: { paddingVertical: 8 },
});
