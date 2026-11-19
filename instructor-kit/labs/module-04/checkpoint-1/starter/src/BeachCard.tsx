import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// Parts B and C: Shoreline Crew HQ's beach card, translated too literally. Rebuild it for a phone:
//   B (Lessons 1.1 and 2.1): every piece of text in a <Text>; the name is the card's heading; the button works
//     with a finger and looks different once the beach is saved (a style array).
//   C (Lesson 2.2): the name and the town in a header row (town at the far end, both centered, the name may shrink);
//     "Parking" and its value side by side (label width 72, the value takes the rest); the access badge only as
//     wide as its word.
export function BeachCard({ site }: { site: Site }) {
  const [saved, setSaved] = useState(false);
  return (
    <View style={styles.card}>
      <View testID="beach-header" style={styles.header}>
        <Text style={styles.name}>{site.name}</Text>
        <Text>{site.town}</Text>
      </View>
      {site.accessible && (
        <View testID="access-badge" style={styles.badge}>
          <Text>Step-free access</Text>
        </View>
      )}
      <View style={styles.detail}>
        Parking
        <Text testID="parking-value">{site.parking}</Text>
      </View>
      <Pressable accessibilityRole="button" onClick={() => setSaved(!saved)} style={styles.button}>
        <Text style={styles.buttonText}>{saved ? 'Saved' : 'Save this beach'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  header: { gap: 8 },
  name: { fontSize: 20, fontWeight: '600', color: '#0b3954' },
  badge: { paddingVertical: 2, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#bfe3df' },
  detail: { flexDirection: 'row', gap: 8 },
  label: { width: 72, color: '#5b6573' },
  button: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonSaved: { backgroundColor: '#2d6a4f' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
