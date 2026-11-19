// npm run web: the lab's FlashList in the web preview (optional; Ctrl+C stops it)
import { View } from 'react-native';

import page1 from './fixtures/past-page-1.json';
import page2 from './fixtures/past-page-2.json';
import page3 from './fixtures/past-page-3.json';
import { PastList } from './src/months';

export default function App() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <PastList cleanups={[...page1, ...page2, ...page3]} />
    </View>
  );
}
