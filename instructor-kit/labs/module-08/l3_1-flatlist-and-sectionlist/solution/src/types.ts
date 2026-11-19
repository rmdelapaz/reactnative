// The fields of GET /api/sites that these lists use (fixtures/sites.json has the whole answer)
export type Site = {
  id: string;
  name: string;
  town: string;
  terrain: 'sand' | 'rock' | 'mixed';
  accessible: boolean;
};

// The beaches as the screen knows them: still loading, failed, or here
export type Load =
  | { status: 'loading' }
  | { status: 'failed'; message: string }
  | { status: 'loaded'; sites: Site[] };
