// Shoreline Crew's cache: adapted from Shoreline Crew HQ's src/api/queries.ts (the same settings
// and key shapes), with the phone's own data: upcoming cleanups page by page, you, your sign-ups.
import {
  infiniteQueryOptions,
  MutationCache,
  QueryCache,
  QueryClient,
  queryOptions,
} from '@tanstack/react-query';

import {
  ApiError,
  getEvent,
  getEvents,
  getMe,
  getMySignups,
  getSites,
  type Session,
} from '@/api/client';
import { markSignInEnded } from '@/auth/ended';

// One place for every 401 (new): a query or a mutation whose token the API no longer knows.
// The client has already forgotten the session; this tells the screens that say so.
function noticeEndedSignIn(error: Error) {
  if (error instanceof ApiError && error.status === 401) {
    markSignInEnded();
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: noticeEndedSignIn }),
  mutationCache: new MutationCache({ onError: noticeEndedSignIn }),
  defaultOptions: {
    queries: {
      // An answer counts as fresh for 30 seconds: no new request for it in that time
      staleTime: 30_000,
      // Try again after a network or server failure, but never after 401, 403 or 404:
      // asking again will not change those answers
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
});

/** Who is asking: a person's id, or 'guest'. Some answers depend on it, so it goes in their keys. */
export function viewerId(session: Session | null): string {
  return session?.user.id ?? 'guest';
}

/** The six beach sites (the same for everyone) */
export function sitesQuery() {
  return queryOptions({
    queryKey: ['sites'],
    queryFn: ({ signal }) => getSites(signal),
  });
}

// How many cleanups to ask the API for at a time
const perPage = 5;

/** Upcoming cleanups, a page at a time (organizers also get drafts: the viewer is in the key) */
export function upcomingEventsQuery(viewer: string) {
  return infiniteQueryOptions({
    queryKey: ['events', 'upcoming', viewer],
    queryFn: ({ pageParam, signal }) =>
      getEvents(`when=upcoming&page=${pageParam}&perPage=${perPage}`, signal),
    initialPageParam: 1,
    // The page after the last one loaded, or undefined: there is no next page
    getNextPageParam: (lastPage) =>
      lastPage.page.page < lastPage.page.totalPages ? lastPage.page.page + 1 : undefined,
  });
}

/** One cleanup with its site */
export function eventQuery(eventId: string, viewer: string) {
  return queryOptions({
    queryKey: ['events', 'detail', eventId, viewer],
    queryFn: ({ signal }) => getEvent(eventId, signal),
  });
}

/** Who the API thinks is signed in: asking is how the phone finds out a sign-in has ended */
export function meQuery(viewer: string) {
  return queryOptions({
    queryKey: ['me', viewer],
    queryFn: ({ signal }) => getMe(signal),
  });
}

/** Your sign-ups, each with its cleanup (signed in only) */
export function mySignupsQuery(viewer: string) {
  return queryOptions({
    queryKey: ['signups', viewer],
    queryFn: ({ signal }) => getMySignups(signal),
  });
}
