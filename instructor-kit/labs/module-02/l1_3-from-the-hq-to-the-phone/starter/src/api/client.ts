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

/** What to tell people when a request failed (copied from the HQ as it is) */
export function describeError(error: unknown): string {
  if (error instanceof ApiError && error.status === 404) {
    return 'Nothing was found at this address. Check the link.';
  }
  if (error instanceof ApiError) {
    return `The server had a problem (${error.status}). Try again in a moment.`;
  }
  // Task 2: in a browser, a fetch that gets no answer rejects with a TypeError
  if (error instanceof TypeError) {
    return 'Could not reach the server. Check that shoreline-api is running, then try again.';
  }
  return 'Something unexpected went wrong. Try again in a moment.';
}

// ---------------------------------------------------------------- talking to the API
/** Where the API runs, from .env.local (Task 3: tests pass, and `npm run lint` does not) */
export function apiBaseUrl(): string {
  const { EXPO_PUBLIC_API_URL: url } = process.env;
  if (url === undefined || url === '') {
    throw new Error('EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local');
  }
  return url;
}

/** Send a request to a path under /api. Throws ApiError on an error status. */
async function request(path: string): Promise<Response> {
  const response = await fetch(`${apiBaseUrl()}/api${path}`);
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
