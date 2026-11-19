// The site shape this lab uses, as shoreline-api sends it (shortened: the API sends more fields).
// fixtures/sites.json is the real answer of GET /api/sites, saved from the course API.
export type Terrain = 'sand' | 'rocky' | 'marsh' | 'mixed';

export interface Site {
  id: string;
  name: string;
  town: string;
  terrain: Terrain;
  accessible: boolean;
  image: { url: string; alt: string; width: number; height: number };
}
