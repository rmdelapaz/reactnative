// What `npm run web` shows: every beach that passes the guard, as a card (a look, not a test)
import { ScrollView, StyleSheet } from 'react-native';

import sites from './fixtures/sites.json';
import { BeachCard } from './src/BeachCard';
import { isSite } from './src/site';

export default function App() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {(sites as unknown[]).filter(isSite).map((site) => (
        <BeachCard key={site.id} site={site} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fbf6ec' },
  content: { gap: 16, padding: 16 },
});
