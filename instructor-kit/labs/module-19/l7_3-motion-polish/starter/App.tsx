// What `npm run web` shows: the lab's components on a plain screen (not a test). In the web preview,
// Chrome's DevTools > Rendering > "Emulate CSS media feature prefers-reduced-motion" changes nothing here:
// this screen passes reduceMotion itself (the switch below), as Task 1's rule would decide it.
import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { reduceMotionFrom } from './src/motion';
import { SavedMark } from './src/SavedMark';
import { TagList } from './src/TagList';

export default function App() {
  const [calm, setCalm] = useState(false);
  const [tags, setTags] = useState(['Glass', 'Rope', 'Bottle caps']);
  const reduceMotion = reduceMotionFrom(false, calm);
  return (
    <View style={styles.screen}>
      <View style={styles.row}>
        <SavedMark key={String(reduceMotion)} reduceMotion={reduceMotion} />
        <Text accessibilityRole="header" style={styles.heading}>
          Photo saved
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Calm photos</Text>
        <Switch value={calm} onValueChange={setCalm} accessibilityLabel="Calm photos" />
      </View>
      <TagList tags={tags} onRemove={(tag) => setTags((now) => now.filter((other) => other !== tag))} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16, padding: 24, backgroundColor: '#fbf6ec' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  heading: { fontSize: 22, fontWeight: '700' },
  label: { flex: 1 },
});
