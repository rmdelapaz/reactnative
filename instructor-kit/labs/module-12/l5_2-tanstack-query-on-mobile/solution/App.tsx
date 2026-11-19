// The lab's components in the web preview (npm run web): the same Providers and list the tests render
import NetInfo from '@react-native-community/netinfo';
import { QueryClient } from '@tanstack/react-query';
import { Platform } from 'react-native';

import { connectOnlineManager } from './src/online';
import { PastCleanups } from './src/PastCleanups';
import { Providers } from './src/Providers';

const client = new QueryClient();

// A phone has no browser events: NetInfo is the source (the web preview keeps the browser's own)
if (Platform.OS !== 'web') {
  connectOnlineManager(NetInfo.addEventListener);
}

export default function App() {
  return (
    <Providers client={client}>
      <PastCleanups base={process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'} />
    </Providers>
  );
}
