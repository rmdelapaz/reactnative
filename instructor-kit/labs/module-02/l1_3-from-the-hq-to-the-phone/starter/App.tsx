// What `npm run web` shows: the lab's component on a plain screen (a look, not a test). It asks the API at
// EXPO_PUBLIC_API_URL: start Metro with EXPO_PUBLIC_API_URL=http://localhost:4000 npm run web, the API running.
import { StyleSheet, Text, View } from 'react-native';

import { NextUp } from './src/components/NextUp';
import { greeting } from './src/shared/eventText';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text>{greeting()}</Text>
      <NextUp />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
