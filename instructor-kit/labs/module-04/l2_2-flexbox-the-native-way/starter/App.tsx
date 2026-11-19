// What `npm run web` shows: every beach's panel on a plain screen (a look, not a test)
import { ScrollView, StyleSheet } from 'react-native';

import sites from './fixtures/sites.json';
import { SitePanel } from './src/SitePanel';
import type { Site } from './src/types';

export default function App() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {(sites as Site[]).map((site) => (
        <SitePanel key={site.id} site={site} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fbf6ec' },
  content: { gap: 16, padding: 16 },
});
