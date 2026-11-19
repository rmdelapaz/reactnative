// What `npm run web` shows: the checkpoint's row on a plain screen (not a test)
import { StyleSheet, View } from 'react-native';

import { CleanupRow } from './src/CleanupRow';

export default function App() {
  return (
    <View style={styles.screen}>
      <CleanupRow title="Tide Pool Morning Cleanup" spotsLeft={5} onJoin={() => {}} />
      <CleanupRow title="Weekend Cove Cleanup" spotsLeft={0} onJoin={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
