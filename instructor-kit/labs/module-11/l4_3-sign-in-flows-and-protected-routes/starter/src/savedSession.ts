// The copy of the session kept on the phone, in secure storage (the course app's src/auth/session.ts)
import * as SecureStore from 'expo-secure-store';

import { setSession } from './session';
import type { Session } from './types';

// The name of the saved session (letters, numbers, ".", "-" and "_" only)
export const sessionKey = 'crew-lab-session';

/** Is this value (JSON read back from storage) really a session? Old or damaged data is not. */
export function isSession(value: unknown): value is Session {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { token, user } = value as { token?: unknown; user?: unknown };
  if (typeof token !== 'string' || typeof user !== 'object' || user === null) {
    return false;
  }
  const { id, name, email, role } = user as Record<string, unknown>;
  return (
    typeof id === 'string' &&
    typeof name === 'string' &&
    typeof email === 'string' &&
    (role === 'organizer' || role === 'volunteer')
  );
}

/** Start with the session saved on this phone. Call it once, when the app starts. */
export async function restoreSession(): Promise<void> {
  // TODO 2: ask SecureStore.isAvailableAsync() first (the web preview has no secure storage), trust the
  // saved JSON only after isSession() says yes, never reject (whatever goes wrong, nobody is signed in),
  // and from then on save every change (onSessionChange: setItemAsync, or deleteItemAsync for null).
  const saved = await SecureStore.getItemAsync(sessionKey);
  if (saved !== null) {
    setSession(JSON.parse(saved));
  }
}
