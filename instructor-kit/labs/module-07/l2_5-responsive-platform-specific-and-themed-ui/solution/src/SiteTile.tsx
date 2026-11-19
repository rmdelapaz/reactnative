import { StyleSheet, Text, View } from 'react-native';

import { createThemedStyles } from './theme/theme';
import type { Site } from './types';

// A beach's tile, by day and by night: the style sheets are made once per theme, the component picks one
export function SiteTile({ site }: { site: Site }) {
  const styles = useStyles();
  return (
    <View testID="tile" style={styles.tile}>
      <Text style={styles.name}>{site.name}</Text>
      <Text style={styles.town}>{site.town}</Text>
    </View>
  );
}

const useStyles = createThemedStyles(({ colors }) => StyleSheet.create({
  tile: { flex: 1, gap: 4, padding: 16, borderRadius: 12, backgroundColor: colors.surface },
  name: { fontSize: 18, fontWeight: '600', color: colors.text },
  town: { color: colors.textMuted },
}));
