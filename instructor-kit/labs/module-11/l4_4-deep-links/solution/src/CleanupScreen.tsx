import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getEvent, signUp } from './api';
import type { CleanupEvent } from './types';

// One cleanup: src/app/cleanups/[id].tsx in the course app. A link opens it with any id, and any extras.
export function CleanupScreen() {
  // A link only ever opens a screen: extras such as ?join=yes are read by nobody, and signing up
  // waits for the volunteer's own press (anyone can write a link and send it to anyone)
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<CleanupEvent | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getEvent(id, controller.signal).then(setEvent, () => {});
    return () => controller.abort();
  }, [id]);

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
