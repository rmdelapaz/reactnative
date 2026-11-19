// What index.ts registers. This lab's screens live in app/ and run in Jest: npm test builds a real
// Expo Router app from that folder (expo-router/testing-library) and opens it at an address.
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text>This lab runs in Jest: open a terminal in this folder and run npm test.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
});
