// Bookmobile Stops' cache (Lesson 5.2): one QueryClient, and one function per kind of answer.
import { keepPreviousData, QueryClient, queryOptions } from '@tanstack/react-query';

import { ApiError, getBooks, getHolds, getStop, getStops, type Session } from '@/api/client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // An answer counts as fresh for 30 seconds
      staleTime: 30_000,
      // Try again after a network or server failure, never after a 4xx: asking again will not change it
      retry: (failureCount, error) => !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
});

/** Who is asking: a patron's id, or 'guest'. Answers that depend on it carry it in their keys. */
export function viewerId(session: Session | null): string {
  return session?.patron.id ?? 'guest';
}

/** The eight weekly stops (the same for everyone) */
export function stopsQuery() {
  return queryOptions({
    queryKey: ['stops'],
    queryFn: ({ signal }) => getStops(signal),
  });
}

/** One stop */
export function stopQuery(stopId: string) {
  return queryOptions({
    queryKey: ['stops', stopId],
    queryFn: ({ signal }) => getStop(stopId, signal),
  });
}

/** The books matching a search ('' = all of them) */
export function booksQuery(search: string) {
  return queryOptions({
    queryKey: ['books', search.trim().toLowerCase()],
    queryFn: ({ signal }) => getBooks(search, signal),
    // While a new search loads, keep showing the last answer instead of a spinner
    placeholderData: keepPreviousData,
  });
}

/** The signed-in patron's holds on the server */
export function holdsQuery(viewer: string) {
  return queryOptions({
    queryKey: ['holds', viewer],
    queryFn: ({ signal }) => getHolds(signal),
  });
}
