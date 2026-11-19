import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

// Any address with no screen in app/ ends up here, instead of Expo Router's own "Unmatched Route" page
export default function NotFoundScreen() {
  return (
    <View style={styles.screen}>
      <Text accessibilityRole="header" style={styles.heading}>
        This page is not on the map
      </Text>
      <Text>The link may be old, or mistyped. Every beach is on the first screen.</Text>
      {/* replace: the list takes this screen's place, so back does not return to a dead end */}
      <Link href="/" replace asChild>
        <Pressable accessibilityRole="button" style={styles.button}>
          <Text style={styles.buttonText}>Back to the sites</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold' },
  button: { alignSelf: 'flex-start', padding: 12, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
