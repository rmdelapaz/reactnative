import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { PastCleanup } from './types';

// One past cleanup, with its report behind a button
export function CleanupRow({ cleanup }: { cleanup: PastCleanup }) {
  // TODO 1: FlashList hands this component another cleanup when it recycles the row
  const [open, setOpen] = useState(false);
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
