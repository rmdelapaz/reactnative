// What `npm run web` shows: the inventory's rows, as the web preview's fallback would (not a test)
import { StyleSheet, Text, View } from 'react-native';

import { inventoryCsv } from './src/inventoryCsv';
import type { GearItem } from './src/types';

const items: GearItem[] = [
  { name: 'Litter grabber', shed: 'North shed', count: 14, lastChecked: '2026-11-02', note: 'Two with loose grips' },
  { name: 'Sand sieve', shed: 'Cove shed', count: 6, lastChecked: null, note: 'Never counted' },
];

export default function App() {
  return (
    <View style={styles.screen}>
      <Text selectable>{inventoryCsv(items).replace('\uFEFF', '').trim()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
});
