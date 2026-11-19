// The six beaches, as GET /api/sites answers (fixtures/sites.json: a real answer of shoreline-api)
import sites from '../fixtures/sites.json';

export type Site = (typeof sites)[number];

export const allSites: Site[] = sites;

// The site with this id, or undefined when no site has it (an old or mistyped link)
export function findSite(id: string): Site | undefined {
  return allSites.find((site) => site.id === id);
}
