// What `npm run web` shows: where the supply van is, and a way to get there (not a test)
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { mapLink } from './src/mapLink';
import { van, vanLabel } from './src/types';
import { VanMap } from './src/VanMap';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Where is the van?</Text>
      <VanMap van={van} label={vanLabel} locationAllowed={false} />
      <Pressable accessibilityRole="button" onPress={() => Linking.openURL(mapLink(van, vanLabel))} style={styles.button}>
        <Text>Open in Maps</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
  heading: { fontSize: 20, fontWeight: '600' },
  button: { alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#d9ecea' },
});
