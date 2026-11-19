// Bookmobile Stops' API client: the ONLY file that calls fetch. Data from the API is unknown until a
// guard (src/api/guards.ts) proves its shape.
import { isApiErrorBody, isBook, isHold, isListOf, isSignInResponse, isStop } from '@/api/guards';
import type { ApiErrorBody, Book, ErrorCode, Hold, NewHold, SignInRequest, SignInResponse, Stop } from '@/api/types';

// ---------------------------------------------------------------- errors

/** The API answered, but with an error status (400, 401, 404, 409, 500...) */
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

/** The request never got an answer: no signal, a wrong address, or the API is not running */
export class NetworkError extends Error {
  readonly address: string;

  constructor(cause: unknown, address: string) {
    super(`Could not reach the API at ${address}`, { cause });
    this.name = 'NetworkError';
    this.address = address;
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
  if (error instanceof ApiError && error.status < 500) {
    return error.message; // the API's own words: "You already have a hold on this book."
  }
  if (error instanceof ApiError) {
    return `The server had a problem (${error.status}). Try again in a moment.`;
  }
  if (error instanceof NetworkError) {
    return `Could not reach the bookmobile's server at ${error.address}. Check your connection, then try again.`;
  }
  return 'Something unexpected went wrong. Try again in a moment.';
}

// ---------------------------------------------------------------- the session (in memory)

/** A signed-in patron: the API's token, and who it belongs to */
export type Session = SignInResponse;

// The session lives here, in memory, so every request can read it. Keeping a copy on the phone is
// src/auth/session.ts's job (Lesson 4.3).
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

/** The API's address, from .env.local (Lesson 5.1: on a phone, your computer's LAN address) */
export function apiBaseUrl(): string {
  return (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4100').replace(/\/+$/, '');
}

/** Send a request to a path under /api, signed in if there is a session */
async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const base = apiBaseUrl();
  const headers = new Headers(init.headers);
  const session = readSession();
  if (session !== null) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${base}/api${path}`, { ...init, headers });
  } catch (error) {
    throw new NetworkError(error, base);
  }
  if (!response.ok) {
    if (response.status === 401 && session !== null) {
      // The API no longer knows this sign-in (it restarted): forget it here too
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

/** GET a path and check the JSON with a guard before anyone uses it */
async function getJSON<T>(path: string, isT: (value: unknown) => value is T, signal?: AbortSignal): Promise<T> {
  const response = await request(path, { signal });
  const data: unknown = await response.json();
  if (!isT(data)) {
    throw new Error(`Unexpected data from GET /api${path}`);
  }
  return data;
}

/** POST JSON, and check the JSON that comes back */
async function postJSON<T>(path: string, body: unknown, isT: (value: unknown) => value is T): Promise<T> {
  const response = await request(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json();
  if (!isT(data)) {
    throw new Error(`Unexpected data from POST /api${path}`);
  }
  return data;
}

/** GET /api/stops: the eight weekly stops, Monday first */
export function getStops(signal?: AbortSignal): Promise<Stop[]> {
  return getJSON('/stops', isListOf(isStop), signal);
}

/** GET /api/stops/:id. An unknown id is an ApiError with status 404. */
export function getStop(id: string, signal?: AbortSignal): Promise<Stop> {
  return getJSON(`/stops/${encodeURIComponent(id)}`, isStop, signal);
}

/** GET /api/books?q=: the collection, by title; q matches a title or an author */
export function getBooks(search: string, signal?: AbortSignal): Promise<Book[]> {
  const query = search.trim() === '' ? '' : `?q=${encodeURIComponent(search.trim())}`;
  return getJSON(`/books${query}`, isListOf(isBook), signal);
}

/** POST /api/auth/sign-in. 400: fields to fix; 401: the card number and PIN do not match. */
export function postSignIn(credentials: SignInRequest): Promise<Session> {
  return postJSON('/auth/sign-in', credentials, isSignInResponse);
}

/** POST /api/auth/sign-out: the API forgets the token */
export async function postSignOut(): Promise<void> {
  await request('/auth/sign-out', { method: 'POST' });
}

/** GET /api/holds: the signed-in patron's holds (401 without a sign-in) */
export function getHolds(signal?: AbortSignal): Promise<Hold[]> {
  return getJSON('/holds', isListOf(isHold), signal);
}

/** POST /api/holds: 201 the first time; 200 with the same hold when this clientId came before */
export function postHold(hold: NewHold): Promise<Hold> {
  return postJSON('/holds', hold, isHold);
}
