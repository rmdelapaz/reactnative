import { useSyncExternalStore } from 'react';

import { onSessionChange, readSession } from './session';
import type { Session } from './types';

/** Who is signed in (null: nobody). Components that use it draw again on every change. */
export function useSession(): Session | null {
  // The third function is for the web preview's server, which draws pages before anyone signs in
  return useSyncExternalStore(onSessionChange, readSession, () => null);
}
