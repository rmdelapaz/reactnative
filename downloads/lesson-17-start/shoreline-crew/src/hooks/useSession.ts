import { useSyncExternalStore } from 'react';

import { onSessionChange, readSession, type Session } from '@/api/client';

/** Who is signed in (null: nobody). Components that use it re-render on every sign-in and sign-out. */
export function useSession(): Session | null {
  // The third function is for the web preview's server, which draws pages before any sign-in
  return useSyncExternalStore(onSessionChange, readSession, () => null);
}
