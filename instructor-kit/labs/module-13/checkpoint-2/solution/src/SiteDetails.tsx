import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { describeError } from './api';
import { siteQuery } from './queries';

// Task 2: one site, with every state a screen that reads the network has
export function SiteDetails({ id }: { id: string }) {
  const site = useQuery(siteQuery(id));

  if (site.data === undefined) {
    if (site.isError) {
      return (
        <View style={styles.details}>
          <Text accessibilityRole="alert">{describeError(site.error)}</Text>
          <Pressable accessibilityRole="button" onPress={() => site.refetch()} style={styles.button}>
            <Text style={styles.buttonText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
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
