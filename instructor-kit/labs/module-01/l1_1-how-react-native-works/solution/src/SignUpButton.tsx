import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

// onPress is a finger on the screen (onClick does nothing on a phone); pressed is the finger-down state
export function SignUpButton() {
  const [joined, setJoined] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => setJoined(!joined)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.label}>{joined ? "You're in!" : 'Sign up'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  pressed: { opacity: 0.7 },
  label: { color: '#ffffff', fontWeight: 'bold' },
});
