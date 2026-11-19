import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import next from '../../fixtures/next.json';

// The first screen: the next cleanup, and a link to its own screen
export default function NextCleanupScreen() {
  const cleanup = next[0];
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>
        Next cleanup
      </Text>
      <Text>{cleanup.title}</Text>
      <Link href={{ pathname: '/cleanups/[id]', params: { id: cleanup.id } }} asChild>
        <Pressable accessibilityLabel={`Open ${cleanup.title}`} style={styles.button}>
          <Text>Open</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 24 },
  title: { fontSize: 24, fontWeight: '600' },
  button: { minHeight: 48, justifyContent: 'center' },
});
