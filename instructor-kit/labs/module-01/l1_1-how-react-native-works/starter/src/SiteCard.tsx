import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// Task 1: Shoreline Crew HQ's web card, translated too literally. On a phone this screen is a red error
// screen. Rebuild it from React Native's building blocks: the site's name is the card's heading.
//   web:  <article><h3>{site.name}</h3><p>{site.town}</p><p>access line</p></article>
export function SiteCard({ site }: { site: Site }) {
  return (
    <View style={styles.card}>
      {site.name}
      <Text style={styles.town}>{site.town}</Text>
      <Text>{site.accessible ? 'Step-free access' : 'Stairs or rough ground'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 4, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0b3954' },
  town: { color: '#1f6f8b' },
});
