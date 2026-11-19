// Signing out, and the copy of the session kept on the phone (rewritten: the HQ kept its copy in
// the browser's session storage, which a phone does not have)
import * as SecureStore from 'expo-secure-store';

import {
  isSignInResponse,
  onSessionChange,
  postSignOut,
  readSession,
  setSession,
} from '@/api/client';

// The name of the saved session in secure storage (letters, numbers, ".", "-" and "_" only)
const sessionKey = 'shoreline-crew-session';

/**
 * Start with the session saved on this phone, and keep the saved copy up to date from then on.
 * Call it once, when the app starts. It never fails: if anything goes wrong, nobody is signed in.
 */
export async function loadSession(): Promise<void> {
  // The phone's secure storage: the iOS Keychain, or values encrypted with the Android Keystore.
  // The web preview has none, so there the session lives in memory only.
  if (!(await SecureStore.isAvailableAsync())) {
    return;
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

/** Sign out: tell the API, and forget the session on this phone at once */
export function signOut(): void {
  // The request takes the token with it as it starts; then the phone forgets the session
  postSignOut().catch(() => {
    // Nothing to do: the API forgets its sessions when it restarts anyway
  });
  setSession(null);
}
