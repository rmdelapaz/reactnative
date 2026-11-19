// The cache (Lesson 5.2): one QueryClient with the HQ's settings, and a factory per kind of answer.
// Keys go from general to specific, so invalidating ['items'] refreshes every list and every item.
import { QueryClient, queryOptions } from '@tanstack/react-query';

import { ApiError, getItem, getItems } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // An answer counts as fresh for 30 seconds: no new request for it in that time
      staleTime: 30_000,
      // Try again after a network or server failure, but never after a 4xx: asking again will
      // not change those answers
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
});

export const itemKeys = {
  all: ['items'] as const,
  list: () => ['items', 'list'] as const,
  detail: (id: string) => ['items', 'detail', id] as const,
};

export function itemsQuery() {
  return queryOptions({ queryKey: itemKeys.list(), queryFn: () => getItems() });
}

export function itemQuery(id: string) {
  return queryOptions({ queryKey: itemKeys.detail(id), queryFn: () => getItem(id) });
}
