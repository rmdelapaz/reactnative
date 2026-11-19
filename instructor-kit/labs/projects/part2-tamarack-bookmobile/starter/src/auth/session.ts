// Signing out, and the copy of the session kept on the phone (Lesson 4.3): SecureStore on a phone,
// memory only in the web preview (it has no secure storage).
import { postSignOut, setSession } from '@/api/client';

// The name of the saved session in secure storage (letters, numbers, ".", "-" and "_" only)
export const sessionKey = 'bookmobile-session';

/**
 * TODO R2a. Start with the session saved on this phone, and keep the saved copy up to date from
 * then on. Called once, when the app starts (src/app/_layout.tsx). It never fails: if anything goes
 * wrong, nobody is signed in. Lesson 4.3's src/auth/session.ts is the model:
 * - no secure storage (SecureStore.isAvailableAsync(), false in the web preview): memory only, return;
 * - read sessionKey, JSON.parse it, and setSession() it only if isSignInResponse() (src/api/guards.ts)
 *   says it is one;
 * - from then on, onSessionChange(): save every new session under sessionKey, delete it on sign-out.
 */
export async function loadSession(): Promise<void> {
  throw new Error(`TODO R2a: load the session saved as ${sessionKey}`);
}

/** Sign out (given): tell the API, and forget the session on this phone at once */
export function signOut(): void {
  postSignOut().catch(() => {
    // Nothing to do: the API forgets its sessions when it restarts anyway
  });
  setSession(null);
}
