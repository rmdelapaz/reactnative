// What `npm run web` shows: the lab's components on a plain screen (not a test). Change given and save to watch
// the bar glide; turn on reduced motion (DevTools > Rendering) and reload to see the dot hold still.
import { StyleSheet, View } from 'react-native';

import { BagCounter } from './src/BagCounter';
import { LiveBadge } from './src/LiveBadge';
import { SuppliesBar } from './src/SuppliesBar';

export default function App() {
  return (
    <View style={styles.screen}>
      <LiveBadge />
      <SuppliesBar given={12} stock={40} item="gloves" />
      <BagCounter bags={7} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', gap: 24, padding: 24, backgroundColor: '#fbf6ec' },
});
