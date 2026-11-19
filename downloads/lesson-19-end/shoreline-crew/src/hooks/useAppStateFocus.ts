import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

// TanStack Query refetches stale data when the app "regains focus". In a browser that is the tab
// becoming visible again, which it hears by itself. A phone has no tabs and no window events:
// the app moves between the foreground ('active') and the background, and AppState says when.
function onAppStateChange(status: AppStateStatus) {
  // The web preview keeps the browser's own signal
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/** Tell TanStack Query when the app comes back to the foreground. Use once, in the root layout. */
export function useAppStateFocus(): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}
