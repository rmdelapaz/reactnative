// The two shapes this lab uses, as shoreline-api sends them (shortened: the API sends more fields).
// fixtures/sites.json and fixtures/upcoming.json are real answers of GET /api/sites and
// GET /api/events?when=upcoming, saved from the course API.
export interface Site {
  id: string;
  name: string;
  town: string;
  terrain: string;
  accessible: boolean;
}

export interface CleanupEvent {
  id: string;
  title: string;
  siteId: string;
  capacity: number;
  spotsTaken: number;
}
