import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getEvent, signUp } from './api';
import type { CleanupEvent } from './types';

// One cleanup: src/app/cleanups/[id].tsx in the course app. A link opens it with any id, and any extras.
export function CleanupScreen() {
  const { id, join } = useLocalSearchParams<{ id: string; join?: string }>();
  const [event, setEvent] = useState<CleanupEvent | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getEvent(id, controller.signal).then(setEvent, () => {});
    return () => controller.abort();
  }, [id]);

  // TODO 3b: "one tap from the message to signed up!" Is that what a link should do?
  useEffect(() => {
    if (join === 'yes') {
      signUp(id).then(() => setJoined(true), () => {});
    }
  }, [id, join]);

  if (event === null) {
    return <Text>Loading the cleanup…</Text>;
  }
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.title}>
        {event.title}
      </Text>
      <Text>Meet at {event.meetingPoint}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => signUp(event.id).then(() => setJoined(true), () => {})}
        style={styles.button}
      >
        <Text>{joined ? "You're signed up" : 'Sign up'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 12, padding: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  button: { minHeight: 48, justifyContent: 'center' },
});
