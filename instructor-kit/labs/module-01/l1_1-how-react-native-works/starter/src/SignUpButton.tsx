import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

// Task 2: a web habit. The button looks right, type-checks and lints clean, and does nothing when a finger
// presses it. Make the press work, and give the "finger is down" look (pressed: opacity 0.7) while you are here.
export function SignUpButton() {
  const [joined, setJoined] = useState(false);
  return (
    <Pressable accessibilityRole="button" onClick={() => setJoined(!joined)} style={styles.button}>
      <Text style={styles.label}>{joined ? "You're in!" : 'Sign up'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  pressed: { opacity: 0.7 },
  label: { color: '#ffffff', fontWeight: 'bold' },
});
