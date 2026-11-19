// Sign the volunteer up for a cleanup: the four ways the request can end, as one value the screen can show
export type SignUpOutcome =
  | { kind: 'signed-up'; status: 'confirmed' | 'waitlisted' }
  | { kind: 'refused'; message: string }
  | { kind: 'sign-in-ended' }
  | { kind: 'no-answer' };

export async function signUp(api: string, token: string, eventId: string): Promise<SignUpOutcome> {
  let response: Response;
  try {
    response = await fetch(`${api}/api/events/${eventId}/signups`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
    });
  } catch {
    return { kind: 'no-answer' }; // no signal, or the server is down: try again later
  }
  if (response.status === 401) return { kind: 'sign-in-ended' };
  const body: { message?: unknown; status?: 'confirmed' | 'waitlisted' } = await response.json();
  if (!response.ok) {
    return { kind: 'refused', message: typeof body.message === 'string' ? body.message : 'The server said no.' };
  }
  return { kind: 'signed-up', status: body.status ?? 'confirmed' };
}
