import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// The Guide tab, with a link to the tide safety card (a modal of the root stack)
export default function GuideScreen() {
  return (
    <View style={styles.screen}>
      <Text>How to read a tide table, and when the rocks are safe.</Text>
      <Link href="/tide-safety" asChild>
        <Pressable accessibilityRole="button" style={styles.button}>
          <Text>Tide safety</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 16 },
  button: { alignSelf: 'flex-start', padding: 12, borderRadius: 8, backgroundColor: '#eef4f7' },
});
