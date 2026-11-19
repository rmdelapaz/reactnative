// What `npm run web` shows: the check-in desk on a plain screen (not a test). The web preview has no on-screen
// keyboard and draws its own switch: Lesson 2.4 says what a phone shows.
import { StyleSheet, View } from 'react-native';

import upcoming from './fixtures/upcoming.json';
import volunteers from './fixtures/volunteers.json';
import { CheckInDesk } from './src/CheckInDesk';
import type { Volunteer } from './src/types';

export default function App() {
  return (
    <View style={styles.screen}>
      <CheckInDesk event={upcoming[0]} volunteers={(volunteers as Volunteer[]).slice(0, 6)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fbf6ec' },
});
