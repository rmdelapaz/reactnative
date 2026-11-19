import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Tell TanStack Query when the phone loses and finds its connection (Lesson 5.2). Use once, in the
 * root layout. Offline, queries wait ("paused") instead of failing, and carry on when it is back.
 */
export function useOnlineManager(): void {
  useEffect(() => {
    // The web preview keeps the browser's own online and offline events
    if (Platform.OS === 'web') {
      return;
    }
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        // null while NetInfo does not know yet: count that as online. Not isInternetReachable: the
        // Bookmobile API may be on your Wi-Fi, which needs no internet.
        setOnline(state.isConnected !== false);
      }),
    );
  }, []);
}
