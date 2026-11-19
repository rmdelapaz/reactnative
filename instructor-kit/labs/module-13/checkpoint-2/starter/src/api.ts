// The API client (given, complete): typed requests to shoreline-api, the answer checked before it is trusted.
// The tests answer with MSW and real shoreline-api answers (src/fixtures/), at this address:
export const apiUrl = 'http://api.test';

export type SiteSummary = { id: string; name: string; town: string };
export type Site = SiteSummary & { description: string };

/** The API said no: its status and its own sentence */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSiteSummary(value: unknown): value is SiteSummary {
  return isRecord(value) && ['id', 'name', 'town'].every((key) => typeof value[key] === 'string');
}

function isSite(value: unknown): value is Site {
  return isSiteSummary(value) && 'description' in value && typeof value.description === 'string';
}

async function getJSON<T>(path: string, check: (value: unknown) => value is T, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiUrl}/api${path}`, { signal });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message = isRecord(body) && typeof body.message === 'string' ? body.message : `HTTP ${response.status}`;
    throw new ApiError(response.status, message);
  }
  if (!check(body)) {
    throw new Error(`Unexpected answer from ${path}`);
  }
  return body;
}

export function getSites(signal?: AbortSignal): Promise<SiteSummary[]> {
  return getJSON('/sites', (value): value is SiteSummary[] => Array.isArray(value) && value.every(isSiteSummary), signal);
}

export function getSite(id: string, signal?: AbortSignal): Promise<Site> {
  return getJSON(`/sites/${encodeURIComponent(id)}`, isSite, signal);
}

/** A sentence for the screen, whatever went wrong */
export function describeError(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Something went wrong. Try again in a moment.';
}
