import { StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// Every piece of text sits in a <Text>; the heading role is what <h3> was on the web
export function SiteCard({ site }: { site: Site }) {
  return (
    <View style={styles.card}>
      <Text accessibilityRole="header" style={styles.name}>
        {site.name}
      </Text>
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
