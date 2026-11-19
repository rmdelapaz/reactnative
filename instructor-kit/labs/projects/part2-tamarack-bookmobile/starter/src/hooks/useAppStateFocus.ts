import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

// Lesson 5.2: a phone has no browser tab. The app moves between the foreground ('active') and the
// background, and AppState says when: TanStack Query refetches stale answers on the way back.
function onAppStateChange(status: AppStateStatus) {
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
