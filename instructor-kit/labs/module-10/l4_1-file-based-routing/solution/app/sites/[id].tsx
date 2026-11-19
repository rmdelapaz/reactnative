import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { findSite } from '../../src/sites';

// One beach on a screen of its own: /sites/driftwood-cove shows the site with the id driftwood-cove.
// (Shoreline Crew names the route instead, useLocalSearchParams<'/cleanups/[id]'>(), because Metro writes
// its typed routes; a lab has no Metro running, so the params' shape is written out.)
export default function SiteScreen() {
  // The [id] part of the address: always a string, it comes from the address
  const { id } = useLocalSearchParams<{ id: string }>();
  const site = findSite(id);

  // Back where the volunteer came from; opened from a link, there may be nothing to go back to
  function leave() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  if (!site) {
    return (
      <View style={styles.screen}>
        <Text>No beach site has the id {id}.</Text>
        <BackButton onPress={leave} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Options for this screen, set from inside it: the header shows the site's name */}
      <Stack.Screen options={{ title: site.name }} />
      <Text>{site.town}</Text>
      <Text>{site.description}</Text>
      <Text>Parking: {site.parking}</Text>
    </View>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Back to the sites</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 16 },
  button: { alignSelf: 'flex-start', padding: 12, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
