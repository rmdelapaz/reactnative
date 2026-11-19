// What `npm run web` shows: the found items waiting in the queue (not a test)
import { StyleSheet, Text, View } from 'react-native';

import { useFoundQueue } from './src/foundQueue';

useFoundQueue.getState().add(
  {
    clientId: 'f-0001',
    siteId: 'driftwood-cove',
    what: 'Car keys on a red cord',
    foundAt: '2026-06-15T09:40:00.000Z',
  },
  [],
);

export default function App() {
  const items = useFoundQueue((state) => state.items);
  return (
    <View style={styles.screen}>
      {items.map(({ item, photos, status }) => (
        <Text key={item.clientId} style={styles.row}>
          {item.what}: {photos.length} {photos.length === 1 ? 'photo' : 'photos'}, {status}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
  row: { fontSize: 16 },
});
