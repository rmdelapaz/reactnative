// npm run web: the lab's lists in the web preview (optional; Ctrl+C stops it)
import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

import sites from './fixtures/sites.json';
import { BeachList } from './src/BeachList';
import { TownList } from './src/towns';
import type { Site } from './src/types';

export default function App() {
  const [byTown, setByTown] = useState(false);
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Switch value={byTown} onValueChange={setByTown} accessibilityLabel="Group by town" />
        <Text>Group by town</Text>
      </View>
      {byTown ? (
        <TownList sites={sites as Site[]} />
      ) : (
        <BeachList load={{ status: 'loaded', sites: sites as Site[] }} columns={1} onRetry={() => {}} />
      )}
    </View>
  );
}
