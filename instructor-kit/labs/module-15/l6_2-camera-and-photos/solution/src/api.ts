// The practice API's client (given): POST /api/photos and POST /api/found-items. MSW answers them in
// the tests; the photo endpoint answers the way shoreline-api's POST /api/photos does.
export const API = 'http://api.test';
const token = 'dev-volunteer';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** fetch with the sign-in token; an answer that is not OK becomes an ApiError with the server's words */
export async function request(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(`${API}/api${path}`, { ...init, headers });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
        ? body.message
        : `The server answered ${response.status}.`;
    throw new ApiError(response.status, message);
  }
  return response;
}
