import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// A header row: space-between pushes the town to the far end, center lines both up through their middles
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    flexShrink: 1, // keep its natural width, wrap only when the two no longer fit side by side
    fontSize: 20,
    fontWeight: '600',
    color: '#0b3954',
  },
  town: {
    color: '#5b6573',
  },
});
