import { Pressable, StyleSheet, Text, View } from 'react-native';

import { setSession } from './session';
import { useSession } from './useSession';

// A crew badge: who is signed in, and a way out
export function CrewBadge() {
  const session = useSession();
  if (session === null) {
    return (
      <Text accessibilityRole="header" style={styles.name}>
        Not signed in
      </Text>
    );
  }
  return (
    <View style={styles.badge}>
      <Text accessibilityRole="header" style={styles.name}>
        {session.user.name}
      </Text>
      <Text>{session.user.role === 'organizer' ? 'Organizer' : 'Volunteer'}</Text>
      <Pressable accessibilityRole="button" onPress={() => setSession(null)} style={styles.button}>
        <Text>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { gap: 8 },
  name: { fontSize: 20, fontWeight: '700' },
  button: { minHeight: 48, justifyContent: 'center' },
});
