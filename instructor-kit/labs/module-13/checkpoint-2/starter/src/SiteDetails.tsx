import { useQuery } from '@tanstack/react-query';
import { StyleSheet, Text, View } from 'react-native';

import { describeError } from './api';
import { siteQuery } from './queries';

// Task 2: one site, with every state a screen that reads the network has.
// TODO 2: when the request fails, the screen says "Loading the site…" for ever. Show the reason
// (describeError) and a "Try again" button that asks again.
export function SiteDetails({ id }: { id: string }) {
  const site = useQuery(siteQuery(id));

  if (site.data === undefined) {
    return <Text>Loading the site…</Text>;
  }
  return (
    <View style={styles.details}>
      <Text accessibilityRole="header" style={styles.name}>
        {site.data.name}
      </Text>
      <Text>{site.data.town}</Text>
      <Text>{site.data.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  details: { gap: 8, padding: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#2a1257' },
  button: { alignSelf: 'flex-start', minHeight: 48, justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#6534c4' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
