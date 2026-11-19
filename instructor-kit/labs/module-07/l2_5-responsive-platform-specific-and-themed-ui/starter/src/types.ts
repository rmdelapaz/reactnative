// The site shape this lab uses, as shoreline-api sends it (shortened). fixtures/sites.json is the real answer of
// GET /api/sites, saved from the course API.
export interface Site {
  id: string;
  name: string;
  town: string;
}
