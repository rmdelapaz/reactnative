import { StyleSheet, Text, View } from 'react-native';

import { lightColors } from './theme/palettes';
import type { Site } from './types';

// Task 2: a beach's tile. Its colors were baked in when the file loaded: the phone can switch to dark mode all
// night and this tile stays white. Make its style sheet themed (createThemedStyles from ./theme/theme), and call
// the hook it returns inside the component.
export function SiteTile({ site }: { site: Site }) {
  return (
    <View testID="tile" style={styles.tile}>
      <Text style={styles.name}>{site.name}</Text>
      <Text style={styles.town}>{site.town}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, gap: 4, padding: 16, borderRadius: 12, backgroundColor: lightColors.surface },
  name: { fontSize: 18, fontWeight: '600', color: lightColors.text },
  town: { color: lightColors.textMuted },
});
