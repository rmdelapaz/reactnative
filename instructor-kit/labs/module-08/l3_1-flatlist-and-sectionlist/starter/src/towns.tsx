import { StyleSheet, Text } from 'react-native';

import type { Site } from './types';

// One town and its beaches: the shape SectionList wants
export type TownSection = { title: string; data: Site[] };

// The beaches under their towns, the towns in alphabetical order, each town's beaches in the order given
export function groupByTown(sites: Site[]): TownSection[] {
  throw new Error(`TODO 3: group the ${sites.length} beaches by town`);
}

// The beaches under their towns, with the current town's heading pinned at the top
export function TownList({ sites }: { sites: Site[] }) {
  // TODO 3: a SectionList of groupByTown(sites): each beach's name, each town as a heading
  // (accessibilityRole="header", a background color), sticky on every platform
  return <Text>{sites.length} beaches</Text>;
}

export const styles = StyleSheet.create({
  town: { backgroundColor: '#fbf6ec', fontSize: 20, fontWeight: '700', paddingVertical: 4 },
  beach: { paddingVertical: 8 },
});
