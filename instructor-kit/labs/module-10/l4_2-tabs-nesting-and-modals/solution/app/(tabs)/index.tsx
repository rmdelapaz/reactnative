import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { allSites } from '../../src/sites';

// The Sites tab ("/"). A site opens on top of the tabs: its screen is in the root stack.
export default function SitesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      <Text accessibilityRole="header" style={styles.heading}>
        Beach sites
      </Text>
      {allSites.map((site) => (
        <Link key={site.id} href={{ pathname: '/sites/[id]', params: { id: site.id } }} asChild>
          <Pressable style={styles.row} accessibilityLabel={`Open ${site.name}`}>
            <Text style={styles.name}>{site.name}</Text>
            <Text>{site.town}</Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold' },
  row: { padding: 12, borderRadius: 8, backgroundColor: '#eef4f7' },
  name: { fontSize: 18, fontWeight: 'bold' },
});
