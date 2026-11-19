// What `npm run web` shows: the badge, with a way to sign in as the API's sample volunteer (a look, not a test)
import { Pressable, StyleSheet, Text, View } from 'react-native';

import saved from './fixtures/sign-in-theo.json';
import { CrewBadge } from './src/CrewBadge';
import { setSession } from './src/session';
import type { Session } from './src/types';

export default function App() {
  return (
    <View style={styles.screen}>
      <CrewBadge />
      <Pressable accessibilityRole="button" onPress={() => setSession(saved as Session)}>
        <Text>Sign in as Theo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
