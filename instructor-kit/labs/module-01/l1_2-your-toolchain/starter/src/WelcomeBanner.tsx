import { StyleSheet, Text, View } from 'react-native';

// Task 1: the tagline lost its look. The app does not complain: find out who does.
export function WelcomeBanner({ crewName }: { crewName: string }) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {crewName}
      </Text>
      <Text style={styles.tagLine}>Many hands, cleaner sands.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8, padding: 24 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#0b3954' },
  tagline: { fontSize: 18, color: '#1f6f8b' },
});
