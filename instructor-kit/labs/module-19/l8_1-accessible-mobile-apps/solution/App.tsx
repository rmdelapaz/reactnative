// What `npm run web` shows: the lab's components on a plain screen (not a test). The web preview's text size is
// always 1: to see Task 3's large-text layout there, change 1.5 to 0 in TideTiles for a minute.
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PackingItem } from './src/PackingItem';
import { SyncStatus } from './src/SyncStatus';
import { TideTiles } from './src/TideTiles';

export default function App() {
  const [gloves, setGloves] = useState(false);
  const [water, setWater] = useState(true);
  const packed = Number(gloves) + Number(water);
  return (
    <View style={styles.screen}>
      <PackingItem label="Gloves" packed={gloves} onToggle={setGloves} />
      <PackingItem label="Water bottle" packed={water} onToggle={setWater} />
      <SyncStatus message={`${packed} of 2 packed`} />
      <TideTiles low="6:40" high="12:55" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
