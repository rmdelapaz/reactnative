import { StyleSheet, Text, View } from 'react-native';

// The Saved tab: an honest placeholder until the app can keep a list on the phone (Lesson 5.3)
export default function SavedScreen() {
  return (
    <View style={styles.screen}>
      <Text>No saved beaches yet. Saving a beach is coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1, padding: 16 } });
