import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { shiftLabel, signedUp, type Volunteer } from './shifts';

export function SignUpList() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(signedUp);
  const [onlyRepair, setOnlyRepair] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  // Derived on every render, never stored
  const shown = onlyRepair ? volunteers.filter((v) => v.shift === 'repair') : volunteers;
  const count = shown.length === volunteers.length ? `${volunteers.length} volunteers` : `${shown.length} of ${volunteers.length} volunteers`;

  function add() {
    if (name.trim() === '') {
      setMessage('Type a name first.');
      return;
    }
    setVolunteers((current) => [...current, { id: `v${current.length + 1}`, name: name.trim(), shift: 'repair' }]);
    setName('');
    setMessage('');
  }

  const header = (
    <View style={styles.header}>
      <TextInput accessibilityLabel="Volunteer name" value={name} onChangeText={setName} style={styles.input} />
      {message !== '' && <Text accessibilityRole="alert">{message}</Text>}
      <Pressable accessibilityRole="button" onPress={add} style={styles.button}>
        <Text>Add volunteer</Text>
      </Pressable>
      <View style={styles.row}>
        <Text style={styles.grow}>Only repair tables</Text>
        <Switch accessibilityLabel="Only repair tables" value={onlyRepair} onValueChange={setOnlyRepair} />
      </View>
      <Text>{count}</Text>
    </View>
  );

  return (
    <FlatList
      data={shown}
      keyExtractor={(v) => v.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text accessibilityRole="header">{item.name}</Text>
          <Text>{shiftLabel(item.shift)}</Text>
        </View>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={<Text>Nobody yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  header: { gap: 8, paddingBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10 },
  button: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 8, padding: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  grow: { flex: 1 },
  item: { paddingVertical: 8 },
});
