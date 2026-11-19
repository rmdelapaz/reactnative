// "Your sign-in has ended", remembered for the whole app (new). Every 401 a query or a mutation
// gets lands in src/api/queries.ts, which marks it here; Profile and My cleanups show the notice.
import { useSyncExternalStore } from 'react';

import { onSessionChange, readSession } from '@/api/client';

let ended = false;
const listeners = new Set<() => void>();

function setEnded(value: boolean) {
  ended = value;
  for (const listener of listeners) {
    listener();
  }
}

/** The API no longer knows this phone's sign-in (it restarted, or the session expired) */
export function markSignInEnded(): void {
  setEnded(true);
}

// Signing in again clears the notice
onSessionChange(() => {
  if (readSession() !== null) {
    setEnded(false);
  }
});

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** true while screens should say "Your sign-in has ended. Sign in again." */
export function useSignInEnded(): boolean {
  return useSyncExternalStore(subscribe, () => ended, () => false);
}
