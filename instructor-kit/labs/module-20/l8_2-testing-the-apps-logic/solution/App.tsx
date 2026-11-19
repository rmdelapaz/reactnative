// What `npm run web` shows: the gear shed's loans on a plain screen (not a test; optional)
import { StyleSheet, Text, View } from 'react-native';

import { useGearShed } from './src/gearShed';

export default function App() {
  const loans = useGearShed((state) => state.loans);
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header">Gear shed</Text>
      <Text>{loans.length === 0 ? 'Everything is on the shelf.' : `${loans.length} items out`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
