// What `npm run web` shows: Theo's Not sent yet list with two reports (not a test)
import { StyleSheet, View } from 'react-native';

import { useHazardQueue } from './src/hazardQueue';
import { NotSentList } from './src/NotSentList';

useHazardQueue.getState().add('v04', {
  clientId: 'h-0001',
  siteId: 'driftwood-cove',
  kind: 'glass',
  note: 'Bottle glass by the north steps',
  seenAt: '2026-06-15T09:12:00.000Z',
});

export default function App() {
  return (
    <View style={styles.screen}>
      <NotSentList viewer="v04" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
});
