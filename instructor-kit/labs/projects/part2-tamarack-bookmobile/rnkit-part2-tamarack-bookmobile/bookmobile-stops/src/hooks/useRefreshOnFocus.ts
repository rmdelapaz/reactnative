import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Each time this screen comes back into view, fetch its stale answers again: the queries whose
 * keys start with `key` (Lesson 5.2). Tabs keep screens mounted, so coming back to one does not
 * start its queries again. The first focus is skipped: the queries have just loaded.
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
      queryClient.refetchQueries({ queryKey: [key], type: 'active', stale: true });
    }, [queryClient, key]),
  );
}
