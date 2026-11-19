import { useEffect } from 'react';
import { AppState } from 'react-native';

// Runs refresh each time the app comes back to the foreground (a crew leader returns from a call, the camera...)
export function useOnForeground(refresh: () => void) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    // The screen closes: stop listening, or every visit adds one more listener that never goes away
    return () => subscription.remove();
  }, [refresh]);
}
