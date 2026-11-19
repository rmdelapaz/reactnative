// Shoreline Crew's API client: adapted from Shoreline Crew HQ's src/api/client.ts.
// Data from the API is unknown until a check proves its shape.
import { Platform } from 'react-native';

import { AddressError, addressAdvice, addressProblem } from '@/api/address';
import type {
  ApiErrorBody,
  CleanupEvent,
  CleanupEventDetail,
  DateString,
  ErrorCode,
  EventStatus,
  PageInfo,
  Role,
  SignInRequest,
  SignInResponse,
  Signup,
  SignupChanges,
  SignupStatus,
  Site,
  Terrain,
  User,
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

const roles: Role[] = ['organizer', 'volunteer'];

function isUser(value: unknown): value is User {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.email === 'string' &&
    roles.some((role) => role === value.role)
  );
}

export function isSignInResponse(value: unknown): value is SignInResponse {
  return isRecord(value) && typeof value.token === 'string' && isUser(value.user);
}

const signupStatuses: SignupStatus[] = ['confirmed', 'waitlisted', 'cancelled', 'attended', 'no-show'];
const signupTextFields: (keyof Signup)[] = ['id', 'eventId', 'volunteerId', 'note', 'createdAt'];

/** One sign-up, as POST /api/events/:id/signups and PATCH /api/signups/:id send it back (copied) */
function isSignup(value: unknown): value is Signup {
  return (
    isRecord(value) &&
    signupTextFields.every((key) => typeof value[key] === 'string') &&
    signupStatuses.some((status) => status === value.status) &&
    (value.checkedInAt === null || typeof value.checkedInAt === 'string')
  );
}

/** One of your sign-ups, as GET /api/me/signups lists them: the sign-up and its cleanup (new) */
export interface MySignup extends Signup {
  event: CleanupEvent;
}

function isMySignup(value: unknown): value is MySignup {
  return isSignup(value) && 'event' in value && isCleanupEvent(value.event);
}

/** What GET /api/health answers: the API is up, and the date it builds its sample data around */
export interface Health {
  ok: true;
  today: DateString;
}

function isHealth(value: unknown): value is Health {
  return isRecord(value) && value.ok === true && typeof value.today === 'string';
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
  // The API address the request went to, so the message can say which one did not answer
  readonly address: string;

  constructor(cause: unknown, address: string) {
    super(`Could not reach the API at ${address}`, { cause });
    this.name = 'NetworkError';
    this.address = address;
  }
}

/** What to tell people when a request failed */
export function describeError(error: unknown): string {
  if (error instanceof AddressError) {
    // The app was built with a wrong address: say exactly what to fix (a developer's mistake)
    return error.message;
  }
  if (error instanceof ApiError && error.status === 401) {
    return 'Your sign-in has ended. Sign in again.';
  }
  if (error instanceof ApiError && error.status === 409) {
    // The API's own words: "You are already signed up for this cleanup.", "...not open for sign-ups."
    return error.message;
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'Nothing was found at this address. Check the link.';
  }
  if (error instanceof ApiError) {
    return `The server had a problem (${error.status}). Try again in a moment.`;
  }
  if (error instanceof NetworkError) {
    // Which address, and what to try next on this platform (src/api/address.ts)
    return `Could not reach the server at ${error.address}. ${addressAdvice(error.address, Platform.OS)}`;
  }
  return 'Something unexpected went wrong. Try again in a moment.';
}

// ---------------------------------------------------------------- the session (copied, minus the storage)

/** A signed-in volunteer: the API's token, and who it belongs to */
export type Session = SignInResponse;

// The session lives here, in memory, so every request can read it. Keeping a copy on the phone
// (secure storage, which is async) is src/auth/session.ts's job (rewritten).
let current: Session | null = null;
const listeners = new Set<() => void>();

/** The current session, or null when nobody is signed in */
export function readSession(): Session | null {
  return current;
}

/** Change (or with null, forget) the session, and tell everyone who listens */
export function setSession(session: Session | null): void {
  current = session;
  for (const listener of listeners) {
    listener();
  }
}

/** Call listener after every sign-in and sign-out. Returns a function that stops listening. */
export function onSessionChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// ---------------------------------------------------------------- talking to the API

/** The API's address, from .env.local (the one this bundle was built with) */
export function apiBaseUrl(): string {
  // Expo copies EXPO_PUBLIC_ variables into the bundle when Metro builds it (rewritten)
  const url = process.env.EXPO_PUBLIC_API_URL ?? '';
  const problem = addressProblem(url);
  if (problem !== null) {
    throw new AddressError(problem);
  }
  return url.replace(/\/+$/, ''); // a trailing slash would make //api
}

/**
 * Send a request to a path under /api, signed in if there is a session.
 * Throws ApiError on an error status, NetworkError without an answer.
 */
async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const base = apiBaseUrl();
  const url = `${base}/api${path}`;
  const headers = new Headers(init.headers);
  const session = readSession();
  if (session !== null) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch (error) {
    // In the browser a failed fetch is a TypeError; on a phone, Expo's fetch throws its own error
    throw new NetworkError(error, base);
  }
  if (!response.ok) {
    if (response.status === 401 && session !== null) {
      // The API no longer knows this sign-in (it restarted, or the session ended): forget it here too
      setSession(null);
    }
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

/** GET /api/health: a tiny answer that proves this device can reach the API */
export function getHealth(signal?: AbortSignal): Promise<Health> {
  return getJSON('/health', isHealth, signal);
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

/** Send JSON with POST, PATCH or PUT, and check the JSON that comes back (copied) */
async function sendJSON<T>(
  method: 'POST' | 'PATCH' | 'PUT',
  path: string,
  body: unknown,
  isT: (value: unknown) => value is T,
): Promise<T> {
  const response = await request(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json();
  if (!isT(data)) {
    throw new Error(`Unexpected data from ${method} /api${path}`);
  }
  return data;
}

/** POST /api/auth/sign-in. A wrong email or password is an ApiError with status 401. */
export function postSignIn(credentials: SignInRequest): Promise<Session> {
  return sendJSON('POST', '/auth/sign-in', credentials, isSignInResponse);
}

/** POST /api/auth/sign-out: the API forgets the token */
export async function postSignOut(): Promise<void> {
  await request('/auth/sign-out', { method: 'POST' });
}

/** GET /api/auth/me: who the API thinks is signed in. An ended sign-in is an ApiError with status 401. */
export function getMe(signal?: AbortSignal): Promise<User> {
  return getJSON('/auth/me', isUser, signal);
}

/** GET /api/me/signups: your sign-ups, each with its cleanup, the latest cleanup first */
export function getMySignups(signal?: AbortSignal): Promise<MySignup[]> {
  return getJSON('/me/signups', isListOf(isMySignup), signal);
}

/** POST /api/events/:id/signups: sign up for a cleanup. The API decides: a spot, or the waiting list. */
export function postSignup(eventId: string): Promise<Signup> {
  return sendJSON('POST', `/events/${encodeURIComponent(eventId)}/signups`, {}, isSignup);
}

/** PATCH /api/signups/:id with the status 'cancelled': give your spot back */
export function cancelSignup(signupId: string): Promise<Signup> {
  const changes: SignupChanges = { status: 'cancelled' }; // volunteers may only send this status
  return sendJSON('PATCH', `/signups/${encodeURIComponent(signupId)}`, changes, isSignup);
}
