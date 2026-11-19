import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const tips = [
  'Check the tide table before you go: low tide is the safe window',
  'Never turn your back on the waves',
  'Stay off wet, dark rocks: they are the slippery ones',
];

// A modal: it slides up over whatever opened it, and Done puts it away
export default function TideSafetyScreen() {
  // Opened from inside the app, the screen underneath is still there; opened from its address,
  // nothing is underneath, so the Sites tab takes its place
  function done() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
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
