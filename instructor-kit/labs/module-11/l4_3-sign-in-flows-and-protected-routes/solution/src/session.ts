// The session in memory, and everyone who listens to it (the course app keeps this part in
// src/api/client.ts, copied from the HQ). Nothing here knows about secure storage.
import type { Session } from './types';

let current: Session | null = null;
const listeners = new Set<() => void>();

/** The current session, or null when nobody is signed in */
export function readSession(): Session | null {
  return current;
}

/** Change (or with null, forget) the session, and tell everyone who listens */
export function setSession(session: Session | null): void {
  current = session;
  for (const listener of listeners) {
    listener();
  }
}

/** Call listener after every change. Returns a function that stops listening. */
export function onSessionChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
