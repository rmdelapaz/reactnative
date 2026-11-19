// What `npm run web` shows: the voice note panel, with the stand-in phone saying yes (not a test)
import { StyleSheet, View } from 'react-native';

import { VoiceNotePanel } from './src/VoiceNotePanel';

export default function App() {
  return (
    <View style={styles.screen}>
      <VoiceNotePanel />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fbf6ec' },
});
