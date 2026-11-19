import { useRecyclingState } from '@shopify/flash-list';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PastCleanup } from './types';

// One past cleanup, with its report behind a button
export function CleanupRow({ cleanup }: { cleanup: PastCleanup }) {
  // Like useState, but closed again when FlashList reuses this row for another cleanup
  const [open, setOpen] = useRecyclingState(false, [cleanup.id]);
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{cleanup.title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}>
        <Text>{open ? 'Hide report' : 'Show report'}</Text>
      </Pressable>
      {open && <Text>{cleanup.spotsTaken} volunteers came.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 4, paddingVertical: 8 },
  title: { fontSize: 18, fontWeight: '600' },
});
