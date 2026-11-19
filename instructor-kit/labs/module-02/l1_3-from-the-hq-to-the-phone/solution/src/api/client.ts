// The lab's API client: the parts of Shoreline Crew HQ's src/api/client.ts that this lab needs.
// Data from the API is unknown until a check proves its shape.
import type { ApiErrorBody, CleanupEvent, ErrorCode, EventStatus, PageInfo } from './types';

// ---------------------------------------------------------------- checking data (copied)
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const eventStatuses: EventStatus[] = ['draft', 'scheduled', 'completed', 'cancelled'];

function isCleanupEvent(value: unknown): value is CleanupEvent {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.date === 'string' &&
    typeof value.meetingPoint === 'string' &&
    eventStatuses.some((status) => status === value.status) &&
    typeof value.capacity === 'number' &&
    typeof value.spotsTaken === 'number'
  );
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return isRecord(value) && typeof value.error === 'string' && typeof value.message === 'string';
}

// ---------------------------------------------------------------- errors
/** The API answered, but with an error status (404, 500, ...) (copied) */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.error;
  }
}

/** The request never got an answer: no network, a wrong address, or the API is not running (new) */
export class NetworkError extends Error {
  constructor(cause: unknown) {
    super('Could not reach the API', { cause });
    this.name = 'NetworkError';
  }
}

/** What to tell people when a request failed */
export function describeError(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return 'Nothing was found at this address. Check the link.';
  }
  if (error instanceof ApiError) {
    return `The server had a problem (${error.status}). Try again in a moment.`;
  }
  if (error instanceof NetworkError) {
    return 'Could not reach the server. Check that shoreline-api is running, then try again.';
  }
  return 'Something unexpected went wrong. Try again in a moment.';
}

// ---------------------------------------------------------------- talking to the API
/** Where the API runs, from .env.local. Metro copies the value into the bundle only for the full name, with a dot. */
export function apiBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (url === undefined || url === '') {
    throw new Error('EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local');
  }
  return url;
}

/** Send a request to a path under /api. Throws ApiError on an error status, NetworkError without an answer. */
async function request(path: string): Promise<Response> {
  const url = `${apiBaseUrl()}/api${path}`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    // In the browser a failed fetch is a TypeError; on a phone, Expo's fetch throws its own error
    throw new NetworkError(error);
  }
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      isApiErrorBody(body) ? body : { error: 'server_error', message: `HTTP ${response.status}` },
    );
  }
  return response;
}

/** The first upcoming cleanups, and how many there are in all (copied: the page numbers are in the headers) */
export async function getUpcoming(perPage: number): Promise<{ items: CleanupEvent[]; page: PageInfo }> {
  const response = await request(`/events?when=upcoming&perPage=${perPage}`);
  const items: unknown = await response.json();
  if (!Array.isArray(items) || !items.every(isCleanupEvent)) {
    throw new Error('Unexpected data from GET /api/events');
  }
  return {
    items,
    page: {
      page: 1,
      perPage,
      total: Number(response.headers.get('X-Total-Count')),
      totalPages: Number(response.headers.get('X-Total-Pages')),
    },
  };
}
