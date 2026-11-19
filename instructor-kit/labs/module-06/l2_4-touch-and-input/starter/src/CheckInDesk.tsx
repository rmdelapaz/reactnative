import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { BagCountField } from './BagCountField';
import { CheckInButton } from './CheckInButton';
import { parseBags } from './parseBags';
import type { CleanupEvent, Volunteer } from './types';

// Task 3: the desk works with a mouse and fails with a finger. The switch is wired the web way (run npm run
// typecheck), and while the keyboard is open (someone just typed the bag count) the first tap on a Check in button
// would only close the keyboard: the scroll view needs to let taps through to the buttons.
export function CheckInDesk({ event, volunteers }: { event: CleanupEvent; volunteers: Volunteer[] }) {
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [bags, setBags] = useState('');

  const shown = volunteers.filter((v) => !onlyWaiting || !checkedIn.includes(v.id));
  const count = parseBags(bags);

  return (
    <ScrollView testID="desk" contentContainerStyle={styles.desk}>
      <Text accessibilityRole="header" style={styles.title}>
        {event.title}
      </Text>
      <Text>
        {checkedIn.length} of {volunteers.length} checked in
      </Text>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Only volunteers not checked in yet</Text>
        <Switch
          value={onlyWaiting}
          onChange={setOnlyWaiting}
          accessibilityLabel="Only volunteers not checked in yet"
        />
      </View>
      {shown.map((v) => (
        <CheckInButton
          key={v.id}
          name={v.name}
          checkedIn={checkedIn.includes(v.id)}
          onCheckIn={() => setCheckedIn((ids) => [...ids, v.id])}
          onUndo={() => setCheckedIn((ids) => ids.filter((id) => id !== v.id))}
        />
      ))}
      <BagCountField value={bags} onChangeText={setBags} />
      <Text>{count === null ? 'Numbers only' : `${count} bags collected`}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  desk: { gap: 12, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0b3954' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 48 },
  rowLabel: { flex: 1 },
});
