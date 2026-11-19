// What `npm run web` shows: the Share button for one real cleanup (a look, not a test). In a desktop browser
// without a share sheet, pressing it shows the link to copy.
import { StyleSheet, Text, View } from 'react-native';

import e08 from './fixtures/event-e08.json';
import { ShareButton } from './src/ShareButton';

export default function App() {
  return (
    <View style={styles.screen}>
      <Text>{e08.title}</Text>
      <ShareButton event={e08} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
});
