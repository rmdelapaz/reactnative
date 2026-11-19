import { useEffect, useState } from 'react';

import { getPastPage } from './api';
import type { PageInfo, PastCleanup } from './types';

export type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; cleanups: PastCleanup[]; page: PageInfo };

// The next page: not asked for yet, on its way, or failed
export type More = { status: 'idle' } | { status: 'loading' } | { status: 'failed'; message: string };

const message = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong.');

// The past cleanups, page by page: what a FlashList needs for infinite scroll
export function usePastCleanups(api: string) {
  const [load, setLoad] = useState<Load>({ status: 'loading' });
  const [more, setMore] = useState<More>({ status: 'idle' });

  useEffect(() => {
    getPastPage(api, 1)
      .then((first) => setLoad({ status: 'loaded', cleanups: first.items, page: first.page }))
      .catch((error: unknown) => setLoad({ status: 'failed', message: message(error) }));
  }, [api]);

  const hasMore = load.status === 'loaded' && load.page.page < load.page.totalPages;

  // The next page, added after the cleanups the list already has
  function loadNextPage() {
    if (load.status !== 'loaded' || !hasMore) {
      return;
    }
    setMore({ status: 'loading' });
    getPastPage(api, load.page.page + 1)
      .then((next) => {
        setLoad((current) => {
          if (current.status !== 'loaded') {
            return current;
          }

          // A cleanup can move to the next page while you scroll: never show it twice
          const known = new Set(current.cleanups.map((cleanup) => cleanup.id));
          const added = next.items.filter((cleanup) => !known.has(cleanup.id));
          return { ...current, cleanups: [...current.cleanups, ...added], page: next.page };
        });
        setMore({ status: 'idle' });
      })
      .catch((error: unknown) => setMore({ status: 'failed', message: message(error) }));
  }

  // The list is near its end. Only ask when nothing is on its way and the last page did not fail:
  // after a failure, Try again (loadNextPage) is the only way to ask again
  function onEndReached() {
    if (more.status === 'idle') {
      loadNextPage();
    }
  }

  return { load, more, hasMore, loadNextPage, onEndReached };
}
