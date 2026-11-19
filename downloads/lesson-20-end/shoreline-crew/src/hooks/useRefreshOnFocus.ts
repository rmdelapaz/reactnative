import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Each time this screen comes back into view, fetch its stale answers again: the queries whose
 * keys start with `key`. Tabs and stacks keep screens mounted, so returning to one does not
 * start its queries again the way opening a web page does. The first focus is skipped: the
 * queries have just loaded.
 */
export function useRefreshOnFocus(key: string): void {
  const queryClient = useQueryClient();
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      // Only answers a screen uses ('active': a guest's disabled query is left alone) and older
      // than staleTime: the same rule as a browser tab coming back into view
      queryClient.refetchQueries({ queryKey: [key], type: 'active', stale: true });
    }, [queryClient, key]),
  );
}
