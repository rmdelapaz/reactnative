import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import next from '../../fixtures/next.json';

// A cleanup's own screen: /cleanups/e17 (the lab knows only the cleanups in fixtures/next.json)
export default function CleanupScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cleanup = next.find((item) => item.id === id);
  if (!cleanup) {
    return <Text accessibilityRole="alert">No such cleanup: {id}</Text>;
  }
  const left = cleanup.capacity - cleanup.spotsTaken;
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>
        {cleanup.title}
      </Text>
      <Text>Meet at: {cleanup.meetingPoint}</Text>
      <Text>{left === 1 ? '1 spot left' : `${left} spots left`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 24 },
  title: { fontSize: 24, fontWeight: '600' },
});
