import { useEffect } from 'react';
import { AppState } from 'react-native';

// Runs refresh each time the app comes back to the foreground (a crew leader returns from a call, the camera...)
export function useOnForeground(refresh: () => void) {
  useEffect(() => {
    AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    // TODO 3: the listener outlives the screen that started it. Keep what addEventListener returns, and give
    // the effect a cleanup that removes it.
  }, [refresh]);
}
