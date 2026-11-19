import { StyleSheet, View } from 'react-native';

import { FactRow } from './FactRow';
import { SiteHeader } from './SiteHeader';
import { siteTags, TagRow } from './TagRow';
import type { Site } from './types';

// The whole panel (nothing to change here): the three parts in a card
export function SitePanel({ site }: { site: Site }) {
  return (
    <View style={styles.card}>
      <SiteHeader site={site} />
      <TagRow tags={siteTags(site)} />
      <FactRow label="Parking" value={site.parking} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e4dccb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
});
