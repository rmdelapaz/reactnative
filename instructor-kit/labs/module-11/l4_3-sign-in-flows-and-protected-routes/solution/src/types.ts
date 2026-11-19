// The shapes of a sign-in, as shoreline-api sends them (copied from the course app's src/api/types.ts).
// fixtures/sign-in-theo.json is a real answer of POST /api/auth/sign-in (Theo, the sample volunteer) and
// fixtures/me-organizer.json one of GET /api/auth/me for the sample organizer, saved from the course API.
export type Role = 'organizer' | 'volunteer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** A signed-in volunteer: the API's token, and who it belongs to */
export interface Session {
  token: string;
  user: User;
}
