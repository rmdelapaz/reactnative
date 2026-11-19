import type { CleanupEvent } from './types';

// MSW answers this address in the tests (the course app reads EXPO_PUBLIC_API_URL instead)
const api = 'http://api.test';

/** GET /api/events/:id */
export async function getEvent(id: string, signal?: AbortSignal): Promise<CleanupEvent> {
  const response = await fetch(`${api}/api/events/${encodeURIComponent(id)}`, { signal });
  if (!response.ok) {
    throw new Error(`GET /api/events/${id}: ${response.status}`);
  }
  return (await response.json()) as CleanupEvent;
}

/** POST /api/events/:id/signups: sign the volunteer up (only ever after a press) */
export async function signUp(id: string): Promise<void> {
  const response = await fetch(`${api}/api/events/${encodeURIComponent(id)}/signups`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`POST /api/events/${id}/signups: ${response.status}`);
  }
}
