import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Shoreline Crew
      </Text>
      <Text style={styles.tagline}>Many hands, cleaner sands.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0b3954',
  },
  tagline: {
    fontSize: 18,
    color: '#1f6f8b',
  },
});
