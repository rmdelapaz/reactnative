import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Site } from './types';

// The beach card for a phone: native building blocks (1.1), StyleSheet and a style array (2.1), flexbox (2.2)
export function BeachCard({ site }: { site: Site }) {
  const [saved, setSaved] = useState(false);
  return (
    <View style={styles.card}>
      <View testID="beach-header" style={styles.header}>
        <Text accessibilityRole="header" style={styles.name}>
          {site.name}
        </Text>
        <Text>{site.town}</Text>
      </View>
      {site.accessible && (
        <View testID="access-badge" style={styles.badge}>
          <Text>Step-free access</Text>
        </View>
      )}
      <View style={styles.detail}>
        <Text style={styles.label}>Parking</Text>
        <Text testID="parking-value" style={styles.value}>
          {site.parking}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setSaved(!saved)}
        style={[styles.button, saved && styles.buttonSaved]}>
        <Text style={styles.buttonText}>{saved ? 'Saved' : 'Save this beach'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8, padding: 16, borderRadius: 12, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { flexShrink: 1, fontSize: 20, fontWeight: '600', color: '#0b3954' },
  badge: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#bfe3df' },
  detail: { flexDirection: 'row', gap: 8 },
  label: { width: 72, color: '#5b6573' },
  value: { flex: 1 },
  button: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonSaved: { backgroundColor: '#2d6a4f' },
  buttonText: { color: '#ffffff', fontWeight: 'bold' },
});
