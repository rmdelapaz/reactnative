// Shoreline Crew's API client: adapted from Shoreline Crew HQ's src/api/client.ts.
// Data from the API is unknown until a check proves its shape.
import type {
  ApiErrorBody,
  CleanupEvent,
  CleanupEventDetail,
  ErrorCode,
  EventStatus,
  PageInfo,
  Site,
  Terrain,
} from '@/api/types';

// ---------------------------------------------------------------- checking data (copied)

/** An object (not null, not an array), so its properties can be read */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

const eventStatuses: EventStatus[] = ['draft', 'scheduled', 'completed', 'cancelled'];

export function isEventStatus(value: unknown): value is EventStatus {
  return eventStatuses.some((status) => status === value);
}

// The CleanupEvent properties that hold text
const eventTextFields: (keyof CleanupEvent)[] = [
  'id', 'title', 'siteId', 'date', 'startTime', 'endTime',
  'meetingPoint', 'description', 'leadOrganizerId', 'createdAt', 'updatedAt',
];

export function isCleanupEvent(value: unknown): value is CleanupEvent {
  return (
    isRecord(value) &&
    eventTextFields.every((key) => typeof value[key] === 'string') &&
    isEventStatus(value.status) &&
    typeof value.capacity === 'number' &&
    typeof value.spotsTaken === 'number' &&
    isStringArray(value.suppliesProvided)
  );
}

const terrains: Terrain[] = ['sand', 'rocky', 'marsh', 'mixed'];
const siteTextFields: (keyof Site)[] = ['id', 'name', 'town', 'parking', 'description'];

export function isSite(value: unknown): value is Site {
  return (
    isRecord(value) &&
    siteTextFields.every((key) => typeof value[key] === 'string') &&
    terrains.some((terrain) => terrain === value.terrain) &&
    typeof value.accessible === 'boolean' &&
    typeof value.latitude === 'number' &&
    typeof value.longitude === 'number' &&
    isRecord(value.image) &&
    typeof value.image.url === 'string' &&
    typeof value.image.alt === 'string' &&
    typeof value.image.width === 'number' &&
    typeof value.image.height === 'number'
  );
}

/** A cleanup as GET /api/events/:id sends it: a CleanupEvent plus its whole site
 * (and, for organizers, the code volunteers type to check in on the day) */
export function isCleanupEventDetail(value: unknown): value is CleanupEventDetail {
  return (
    isCleanupEvent(value) &&
    'site' in value &&
    isSite(value.site) &&
    (!('checkInCode' in value) || typeof value.checkInCode === 'string')
  );
}

/** A check for one item becomes a check for a list of them */
function isListOf<T>(isT: (value: unknown) => value is T) {
  return (value: unknown): value is T[] => Array.isArray(value) && value.every(isT);
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return isRecord(value) && typeof value.error === 'string' && typeof value.message === 'string';
}

// ---------------------------------------------------------------- errors

/** The API answered, but with an error status (404, 500, ...) (copied) */
export class ApiError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly fieldErrors: Record<string, string[]> | undefined;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.code = body.error;
    this.fieldErrors = body.fieldErrors;
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
  if (error instanceof ApiError && error.status === 401) {
    return 'Your sign-in has ended. Sign in again.';
  }
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

function apiBaseUrl(): string {
  // Expo copies EXPO_PUBLIC_ variables into the bundle when Metro builds it (rewritten)
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (url === undefined || url === '') {
    throw new Error('EXPO_PUBLIC_API_URL is not set: copy .env.example to .env.local');
  }
  return url;
}

/** Send a request to a path under /api. Throws ApiError on an error status, NetworkError without an answer. */
async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const url = `${apiBaseUrl()}/api${path}`;
  let response: Response;
  try {
    response = await fetch(url, init);
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

/** GET a path and check the JSON with a type predicate before anyone uses it */
export async function getJSON<T>(
  path: string,
  isT: (value: unknown) => value is T,
  signal?: AbortSignal,
): Promise<T> {
  const response = await request(path, { signal });
  const data: unknown = await response.json();
  if (!isT(data)) {
    throw new Error(`Unexpected data from GET /api${path}`);
  }
  return data;
}

/** One page of a list, and where it sits in the whole list */
export interface Page<T> {
  items: T[];
  page: PageInfo;
}

/** GET a list: the items are in the body, the page numbers in the response headers */
export async function readPage<T>(
  path: string,
  isItem: (value: unknown) => value is T,
  signal?: AbortSignal,
): Promise<Page<T>> {
  const response = await request(path, { signal });
  const items: unknown = await response.json();
  if (!isListOf(isItem)(items)) {
    throw new Error(`Unexpected data from GET /api${path}`);
  }
  // page and perPage are what we asked for (or the API's defaults, 1 and 10)
  const url = new URL(response.url);
  return {
    items,
    page: {
      page: Number(url.searchParams.get('page') ?? '1'),
      perPage: Number(url.searchParams.get('perPage') ?? '10'),
      total: Number(response.headers.get('X-Total-Count')),
      totalPages: Number(response.headers.get('X-Total-Pages')),
    },
  };
}

export function getSites(signal?: AbortSignal): Promise<Site[]> {
  return getJSON('/sites', isListOf(isSite), signal);
}

/** Cleanups; query is a search string such as 'when=upcoming&perPage=20' */
export function getEvents(query: string, signal?: AbortSignal): Promise<Page<CleanupEvent>> {
  return readPage(`/events?${query}`, isCleanupEvent, signal);
}

/** One cleanup with its site. An unknown id (or a draft) is an ApiError with status 404. */
export function getEvent(id: string, signal?: AbortSignal): Promise<CleanupEventDetail> {
  return getJSON(`/events/${encodeURIComponent(id)}`, isCleanupEventDetail, signal);
}
