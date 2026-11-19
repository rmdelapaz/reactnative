import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// Task 1: the beach's name on the left, its town pushed to the right edge, both lined up through their middles.
// As shipped every View is a column, so the town sits under the name.
export function SiteHeader({ site }: { site: Site }) {
  return (
    <View testID="site-header" style={styles.header}>
      <Text accessibilityRole="header" style={styles.name}>
        {site.name}
      </Text>
      <Text style={styles.town}>{site.town}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0b3954',
  },
  town: {
    color: '#5b6573',
  },
});
