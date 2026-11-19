// What `npm run web` shows: the lab's components on a plain screen (not a test)
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { BagCounter } from './src/BagCounter';
import { BeachList } from './src/BeachList';

export default function App() {
  const [bags, setBags] = useState(0);
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <BagCounter count={bags} onChange={setBags} />
      <BeachList apiUrl="http://localhost:4000" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { gap: 24, padding: 24, backgroundColor: '#fbf6ec' },
});
