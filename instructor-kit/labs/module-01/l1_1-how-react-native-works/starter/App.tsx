// What `npm run web` shows: the lab's components on a plain screen (a look, not a test)
import { ScrollView, StyleSheet, Text } from 'react-native';

import sites from './fixtures/sites.json';
import upcoming from './fixtures/upcoming.json';
import { SignUpButton } from './src/SignUpButton';
import { SiteCard } from './src/SiteCard';
import { spotsLabel } from './src/spots';

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {sites.slice(0, 2).map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
      <Text>{spotsLabel(upcoming[0])}</Text>
      <SignUpButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
