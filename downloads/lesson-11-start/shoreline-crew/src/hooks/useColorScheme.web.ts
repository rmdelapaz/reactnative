import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

// The web preview's pages are drawn on a server first, and a server cannot know the browser's
// setting. So start as 'light', like the server did, then switch once the page runs in the browser.
export function useColorScheme() {
  return useSyncExternalStore(subscribe, getColorScheme, () => 'light' as const);
}

function subscribe(onChange: () => void) {
  const subscription = Appearance.addChangeListener(onChange);
  return () => subscription.remove();
}

function getColorScheme() {
  return Appearance.getColorScheme() ?? 'light';
}
