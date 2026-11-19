// The practice API's client (given): a gear kit in the supply van, and picking it up with the code on
// its tag. MSW answers in the tests. A wrong code is a 400 with a message for the code field (the
// same fieldErrors shape as shoreline-api's check-in); the wrong day a 409.
export const API = 'http://api.test';

export type Kit = { id: string; label: string; status: 'ready' | 'picked-up' };

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

function isKit(value: unknown): value is Kit {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'label' in value &&
    typeof value.label === 'string' &&
    'status' in value &&
    (value.status === 'ready' || value.status === 'picked-up')
  );
}

async function kitRequest(path: string, init?: RequestInit): Promise<Kit> {
  const response = await fetch(`${API}/api${path}`, init);
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const record = typeof body === 'object' && body !== null ? body : {};
    const message = 'message' in record && typeof record.message === 'string' ? record.message : 'Something went wrong.';
    const fieldErrors =
      'fieldErrors' in record && typeof record.fieldErrors === 'object' && record.fieldErrors !== null
        ? (record.fieldErrors as Record<string, string[]>)
        : undefined;
    throw new ApiError(response.status, message, fieldErrors);
  }
  if (!isKit(body)) {
    throw new Error(`Unexpected data from ${path}`);
  }
  return body;
}

/** GET /api/kits/:id */
export function getKit(kitId: string): Promise<Kit> {
  return kitRequest(`/kits/${encodeURIComponent(kitId)}`);
}

/** POST /api/kits/:id/pickup with the code on the tag: the kit comes back 'picked-up' */
export function pickUpKit(kitId: string, code: string): Promise<Kit> {
  return kitRequest(`/kits/${encodeURIComponent(kitId)}/pickup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
}

/** One sentence for the screen */
export function describeError(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Could not reach the server. Try again in a moment.';
}
