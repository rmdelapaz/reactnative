// The shape of one beach, as GET /api/sites sends it (shortened: the API sends more fields).
// fixtures/sites.json is a real answer of the course API, saved once.
export interface Site {
  id: string;
  name: string;
  town: string;
  terrain: 'sand' | 'rocky' | 'mixed' | 'marsh';
  accessible: boolean;
  parking: string;
}
