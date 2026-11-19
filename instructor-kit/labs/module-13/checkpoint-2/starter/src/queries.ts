import { queryOptions } from '@tanstack/react-query';

import { getSite, getSites } from './api';
import { readFavorites } from './favorites';

/** Every site, for the list (given) */
export function sitesQuery() {
  return queryOptions({
    queryKey: ['sites'],
    queryFn: ({ signal }) => getSites(signal),
  });
}

/** One site: its own key, so each site is cached on its own (given) */
export function siteQuery(id: string) {
  return queryOptions({
    queryKey: ['site', id],
    queryFn: ({ signal }) => getSite(id, signal),
  });
}

// TODO 3b: the favorites are on the phone. With no connection, this query waits for one it does not need.
export function favoritesQuery() {
  return queryOptions({
    queryKey: ['favorites'],
    queryFn: readFavorites,
  });
}
