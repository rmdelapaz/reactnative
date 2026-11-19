// A beach search for crew leaders: type part of a beach's name, set a low-tide reminder for one
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import sites from './data/sites.json';
import { remindMe } from './reminders';

export type Site = { id: string; name: string; town: string };

// The beaches whose name contains what the crew leader typed, whatever the case of the letters
export function matchingSites(all: Site[], query: string): Site[] {
  const wanted = query.trim().toLowerCase();
  return all.filter((site) => site.name.toLowerCase().includes(wanted));
}

export function SiteSearch() {
  const [query, setQuery] = useState('');
  const [reminded, setReminded] = useState<string | null>(null);
  const found = matchingSites(sites, query);

  return (
    <View style={styles.screen}>
      <TextInput
        accessibilityLabel="Search beaches"
        placeholder="Search beaches"
        value={query}
        onChangeText={setQuery}
        style={styles.field}
      />
      <Text>{found.length === 1 ? '1 beach' : `${found.length} beaches`}</Text>
      {found.map((site) => (
        <View key={site.id} style={styles.row}>
          <View style={styles.words}>
            <Text style={styles.name}>{site.name}</Text>
            <Text>{site.town}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remind me about low tide at ${site.name}`}
            onPress={async () => {
              await remindMe(site.name);
              setReminded(site.name);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Remind me</Text>
          </Pressable>
        </View>
      ))}
      {reminded !== null && <Text>Reminder set for {reminded}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 12, padding: 24, backgroundColor: '#fbf6ec' },
  field: { borderWidth: 1, borderColor: '#0b3954', borderRadius: 8, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  words: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#0b3954' },
  button: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#1f6f8b' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
