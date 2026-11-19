// The fields of GET /api/events?when=past that these lists use (fixtures/ has the real pages)
export type PastCleanup = {
  id: string;
  title: string;
  siteId: string;
  date: string; // "YYYY-MM-DD"
  spotsTaken: number;
};

// From the response headers: which page this is, and how many there are
export type PageInfo = { page: number; perPage: number; total: number; totalPages: number };
export type Page<T> = { items: T[]; page: PageInfo };
