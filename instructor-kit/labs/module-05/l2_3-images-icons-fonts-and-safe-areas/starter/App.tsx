// What `npm run web` shows: the lab's components on a plain screen (not a test). Start shoreline-api first:
// the picture comes from it (http://localhost:4000/images/sites/...).
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import sites from './fixtures/sites.json';
import { SignUpBar } from './src/SignUpBar';
import { SitePicture } from './src/SitePicture';
import { terrainIcons } from './src/terrainIcons';
import type { Site } from './src/types';

const site = (sites as Site[])[0];

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <View style={styles.card}>
          <SitePicture site={site} />
          <View style={styles.row}>
            <SymbolView name={terrainIcons[site.terrain]} size={20} tintColor="#1f6f8b" />
            <Text>{site.name}</Text>
          </View>
        </View>
      </View>
      <SignUpBar onSignUp={() => {}} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16, backgroundColor: '#fbf6ec' },
  card: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
