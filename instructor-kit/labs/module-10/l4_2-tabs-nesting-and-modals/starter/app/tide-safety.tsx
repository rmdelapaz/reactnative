import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const tips = [
  'Check the tide table before you go: low tide is the safe window',
  'Never turn your back on the waves',
  'Stay off wet, dark rocks: they are the slippery ones',
];

// A modal: it slides up over whatever opened it, and Done puts it away
export default function TideSafetyScreen() {
  // TODO 3: opened from its address (a link, the browser), nothing is underneath and back() does nothing.
  //         Go back when there is something to go back to; otherwise put the Sites tab ('/') in its place.
  function done() {
    router.back();
  }

  return (
    <View style={styles.screen}>
      {tips.map((tip) => (
        <Text key={tip}>{tip}</Text>
      ))}
      <Pressable accessibilityRole="button" onPress={done} style={styles.button}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 16 },
  button: { alignSelf: 'flex-start', padding: 12, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
