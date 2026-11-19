// What `npm run web` shows: which gear reminders this phone would hold (not a test; the web
// preview has no notification scheduler, so nothing is scheduled here)
import { StyleSheet, Text, View } from 'react-native';

import { loansToRemind, reminderTime } from './src/gearReminders';
import type { GearLoan } from './src/types';

const loans: GearLoan[] = [
  { id: 'l-201', item: 'Litter grabber', dueDate: '2026-11-25', status: 'out' },
  { id: 'l-202', item: 'Sand sieve', dueDate: '2026-12-01', status: 'out' },
  { id: 'l-203', item: 'Work gloves', dueDate: '2026-11-22', status: 'returned' },
];

export default function App() {
  const wanted = loansToRemind(loans, new Date('2026-11-20T09:00'));
  return (
    <View style={styles.screen}>
      {wanted.map((loan) => (
        <Text key={loan.id}>
          {loan.item}: remind at {reminderTime(loan).toString()}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 12, padding: 24, backgroundColor: '#fbf6ec' },
});
