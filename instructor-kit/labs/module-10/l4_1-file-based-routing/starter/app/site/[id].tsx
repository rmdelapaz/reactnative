import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { findSite } from '../../src/sites';

// One beach on a screen of its own.
// TODO 1: the list's links go to /sites/<id>, but this file is app/site/[id].tsx. Move it to the folder the
//         address names, and give useLocalSearchParams the shape of this route's params ({ id: string }):
//         npm run typecheck names the problem.
export default function SiteScreen() {
  const { id } = useLocalSearchParams();
  const site = findSite(id);

  // TODO 2: an id that names no site (an old link) shows nothing. Show "No beach site has the id <id>." and a
  //         "Back to the sites" button that goes back when there is a screen underneath, and otherwise
  //         replaces this screen with the list ('/').
  if (!site) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: site.name }} />
      <Text>{site.town}</Text>
      <Text>{site.description}</Text>
      <Text>Parking: {site.parking}</Text>
    </View>
  );
}

// Used by TODO 2
export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>Back to the sites</Text>
    </Pressable>
  );
}

// TODO 2: leave() needs the router: router.canGoBack(), router.back(), router.replace('/')
void router;

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 16 },
  button: { alignSelf: 'flex-start', padding: 12, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
