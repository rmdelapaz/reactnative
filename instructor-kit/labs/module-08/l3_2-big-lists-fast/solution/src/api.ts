import type { Page, PastCleanup } from './types';

export const perPage = 3;

// Given: one page of past cleanups, the page numbers read from the headers (as the course app's getEvents does)
export async function getPastPage(api: string, page: number): Promise<Page<PastCleanup>> {
  const response = await fetch(`${api}/api/events?when=past&page=${page}&perPage=${perPage}`);
  if (!response.ok) {
    throw new Error(`The server answered ${response.status}.`);
  }
  const items: PastCleanup[] = await response.json();
  const number = (name: string) => Number(response.headers.get(name) ?? '0');
  return {
    items,
    page: { page, perPage, total: number('X-Total-Count'), totalPages: number('X-Total-Pages') },
  };
}
