// The API client (Lessons 1.3 and 5.1, from the web course's HQ): every answer is `unknown` until a
// check proves its shape, errors become ApiError or NetworkError, and describeError turns them into
// words for people. The same code talks to the mock API (demo) and to a real server.
import { readDataSource, SourceError } from '@/api/source';
import type { ApiErrorBody, ErrorCode, Item, ItemChanges, ItemStatus, NewItem } from '@/api/types';
import { handle } from '@/mock-api/handle';
import { isItemStatus } from '@/utils/labels';

// ---------------------------------------------------------------- checking data

/** An object (not null, not an array), so its properties can be read */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A check for one item becomes a check for a list of them */
function isListOf<T>(isT: (value: unknown) => value is T) {
  return (value: unknown): value is T[] => Array.isArray(value) && value.every(isT);
}

export function isItem(value: unknown): value is Item {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    (value.note === null || typeof value.note === 'string') &&
    isItemStatus(value.status) &&
    typeof value.createdAt === 'string'
  );
}

// A Record, not an array: a new ErrorCode in types.ts is a type error here until it is added
const errorCodes: Record<ErrorCode, true> = {
  bad_request: true,
  not_found: true,
  conflict: true,
  server_error: true,
};

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    isRecord(value) &&
    typeof value.error === 'string' &&
    Object.hasOwn(errorCodes, value.error) &&
    typeof value.message === 'string'
  );
}

// ---------------------------------------------------------------- errors

/** The API answered, but with an error status (400, 404, 409, 500, ...) */
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

/** The request never got an answer: no network, a wrong address, or the server is not running */
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
  if (error instanceof SourceError) {
    return error.message; // the app was built with a wrong address: say exactly what to fix
  }
  if (error instanceof ApiError && (error.status === 400 || error.status === 409)) {
    return error.message; // the API's own words: "There is already an item called ..."
  }
  if (error instanceof ApiError && error.status === 404) {
    return 'This was not found. It may have been deleted.';
  }
  if (error instanceof ApiError) {
    return `The server had a problem (${error.status}). Try again in a moment.`;
  }
  if (error instanceof NetworkError) {
    return (
      `Could not reach the server at ${error.address}. ` +
      'Check that it is running and that this phone can reach it.'
    );
  }
  return 'Something unexpected went wrong. Try again in a moment.';
}

// ---------------------------------------------------------------- sending requests

type Answer = { status: number; body: unknown };

/** How long the mock API takes to answer: long enough to see the loading states */
const demoDelay = 300;

function pause(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

/** A copy through JSON, as a network makes one: no screen can change the mock API's data */
function copy(value: unknown): unknown {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

async function askMockApi(method: string, path: string, body: unknown): Promise<Answer> {
  await pause(demoDelay);
  const answer = handle({ method, path, body: copy(body) });
  return { status: answer.status, body: copy(answer.body) };
}

async function askServer(
  baseUrl: string,
  method: string,
  path: string,
  body: unknown,
): Promise<Answer> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}/api${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    // On a phone, Expo's fetch throws its own error; in a browser it is a TypeError
    throw new NetworkError(error, baseUrl);
  }
  const data: unknown = await response.json().catch(() => null);
  return { status: response.status, body: data };
}

/** Send a request to a path under /api and check the answer before anyone uses it */
async function send<T>(
  method: string,
  path: string,
  isT: (value: unknown) => value is T,
  body?: unknown,
): Promise<T> {
  const source = readDataSource();
  const answer =
    source.kind === 'demo'
      ? await askMockApi(method, path, body)
      : await askServer(source.baseUrl, method, path, body);
  if (answer.status >= 400) {
    throw new ApiError(
      answer.status,
      isApiErrorBody(answer.body)
        ? answer.body
        : { error: 'server_error', message: `HTTP ${answer.status}` },
    );
  }
  if (!isT(answer.body)) {
    throw new Error(`Unexpected data from ${method} /api${path}`);
  }
  return answer.body;
}

// ---------------------------------------------------------------- the endpoints

export function getItems(status?: ItemStatus): Promise<Item[]> {
  return send('GET', status === undefined ? '/items' : `/items?status=${status}`, isListOf(isItem));
}

export function getItem(id: string): Promise<Item> {
  return send('GET', `/items/${encodeURIComponent(id)}`, isItem);
}

export function postItem(item: NewItem): Promise<Item> {
  return send('POST', '/items', isItem, item);
}

export function patchItem(id: string, changes: ItemChanges): Promise<Item> {
  return send('PATCH', `/items/${encodeURIComponent(id)}`, isItem, changes);
}
