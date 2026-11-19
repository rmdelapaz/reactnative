// GET /api/events?when=past, one page at a time (given: nothing to change here)
export interface PastCleanup {
  id: string;
  title: string;
  date: string;
}

export interface Page {
  items: PastCleanup[];
  page: number;
  total: number;
  totalPages: number;
}

// How many cleanups to ask for at a time
export const perPage = 3;

function isPastCleanup(value: unknown): value is PastCleanup {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'date' in value &&
    typeof value.date === 'string'
  );
}

/** One page of past cleanups; the totals come in the X-Total-Count and X-Total-Pages headers */
export async function getPastCleanups(base: string, page: number, signal?: AbortSignal): Promise<Page> {
  const response = await fetch(`${base}/api/events?when=past&page=${page}&perPage=${perPage}`, { signal });
  if (!response.ok) {
    throw new Error(`GET /api/events answered ${response.status}`);
  }
  const items: unknown = await response.json();
  if (!Array.isArray(items) || !items.every(isPastCleanup)) {
    throw new Error('Unexpected data from GET /api/events');
  }
  return {
    items,
    page,
    total: Number(response.headers.get('X-Total-Count')),
    totalPages: Number(response.headers.get('X-Total-Pages')),
  };
}
