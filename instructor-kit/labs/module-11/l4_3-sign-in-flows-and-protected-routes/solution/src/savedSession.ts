// The copy of the session kept on the phone, in secure storage (the course app's src/auth/session.ts)
import * as SecureStore from 'expo-secure-store';

import { onSessionChange, readSession, setSession } from './session';
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

/**
 * Start with the session saved on this phone, and keep the saved copy up to date from then on.
 * Call it once, when the app starts. It never fails: if anything goes wrong, nobody is signed in.
 */
export async function restoreSession(): Promise<void> {
  // The web preview has no secure storage: there the session lives in memory only
  if (!(await SecureStore.isAvailableAsync())) {
    return;
  }
  try {
    const saved = await SecureStore.getItemAsync(sessionKey);
    const value: unknown = saved === null ? null : JSON.parse(saved);
    setSession(isSession(value) ? value : null);
  } catch (error) {
    console.warn('Could not read the saved session', error);
  }
  // Every change from now on (signing in, signing out, a session the API forgot) is saved too
  onSessionChange(saveCopy);
}

function saveCopy() {
  const session = readSession();
  const saving =
    session === null
      ? SecureStore.deleteItemAsync(sessionKey)
      : SecureStore.setItemAsync(sessionKey, JSON.stringify(session));
  saving.catch((error: unknown) => console.warn('Could not save the session', error));
}
