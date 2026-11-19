import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { FavoriteList } from '../FavoriteList';
import { sitesQuery } from '../queries';

// The first screen, at /: the volunteer's favorites, then every site, each a link to its own screen
export default function HomeScreen() {
  const sites = useQuery(sitesQuery());
  return (
    <View style={styles.page}>
      <Text accessibilityRole="header" style={styles.heading}>
        Your favorites
      </Text>
      <FavoriteList />
      <Text accessibilityRole="header" style={styles.heading}>
        Every site
      </Text>
      {sites.data === undefined && <Text>Loading the sites…</Text>}
      {sites.data?.map((site) => (
        <Link key={site.id} href={{ pathname: '/sites/[id]', params: { id: site.id } }} style={styles.link}>
          {site.name}
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { gap: 8, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', color: '#2a1257' },
  link: { minHeight: 48, paddingVertical: 12, fontSize: 16, color: '#6534c4' },
});
