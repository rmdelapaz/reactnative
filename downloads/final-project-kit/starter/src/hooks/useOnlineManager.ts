import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Tell TanStack Query when the phone loses and finds its connection. Use once, in the root layout.
 * Offline, queries and mutations wait ("paused") instead of failing, and carry on by themselves
 * when the connection is back.
 */
export function useOnlineManager(): void {
  useEffect(() => {
    // The web preview keeps the browser's own online and offline events
    if (Platform.OS === 'web') {
      return;
    }
    // NetInfo calls the function with every change of connection, and returns a way to stop
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) => {
        // isConnected is null while NetInfo does not know yet: count that as online.
        // Not isInternetReachable: a server on your Wi-Fi needs no internet.
        setOnline(state.isConnected !== false);
      }),
    );
  }, []);
}
