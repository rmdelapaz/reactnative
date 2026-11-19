import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { findSite } from '../../src/sites';

// One beach, on top of the tabs (a screen of the root stack: no tab bar while it is open)
export default function SiteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const site = findSite(id);
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: site?.name ?? 'Not found' }} />
      <Text>{site ? site.description : `No beach site has the id ${id}.`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, padding: 16 } });
