// Task 3: the past cleanups as an infinite query: one key, a list of pages, and the way to the next one
import { infiniteQueryOptions } from '@tanstack/react-query';

import { getPastCleanups } from './api';

export function pastCleanupsQuery(base: string) {
  return infiniteQueryOptions({
    queryKey: ['events', 'past', base],
    queryFn: ({ pageParam, signal }) => getPastCleanups(base, pageParam, signal),
    initialPageParam: 1,
    // The page after the last one loaded, or undefined: that was the last page
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });
}
