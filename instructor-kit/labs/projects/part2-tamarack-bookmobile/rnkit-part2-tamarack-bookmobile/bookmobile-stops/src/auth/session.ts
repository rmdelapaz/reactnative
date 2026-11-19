// Signing out, and the copy of the session kept on the phone (Lesson 4.3): SecureStore on a phone,
// memory only in the web preview (it has no secure storage).
import * as SecureStore from 'expo-secure-store';

import { onSessionChange, postSignOut, readSession, setSession } from '@/api/client';
import { isSignInResponse } from '@/api/guards';

// The name of the saved session in secure storage (letters, numbers, ".", "-" and "_" only)
export const sessionKey = 'bookmobile-session';

/**
 * TODO R2a (done). Start with the session saved on this phone, and keep the saved copy up to date
 * from then on. Call it once, when the app starts. It never fails: if anything goes wrong, nobody
 * is signed in.
 */
export async function loadSession(): Promise<void> {
  if (!(await SecureStore.isAvailableAsync())) {
    return; // the web preview: the session lives in memory only (a reload signs out)
  }
  try {
    const saved = await SecureStore.getItemAsync(sessionKey);
    const value: unknown = saved === null ? null : JSON.parse(saved);
    setSession(isSignInResponse(value) ? value : null);
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

/** Sign out (given): tell the API, and forget the session on this phone at once */
export function signOut(): void {
  postSignOut().catch(() => {
    // Nothing to do: the API forgets its sessions when it restarts anyway
  });
  setSession(null);
}
