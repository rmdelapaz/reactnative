// "My stop": the stop a patron usually visits, kept on the phone with AsyncStorage (Lesson 5.3).
// The in-memory part is given; saving it and reading it back is TODO R4c.
import { useSyncExternalStore } from 'react';

// The key the settings are saved under, as one JSON string: { "myStopId": "s03" }
export const settingsKey = 'bookmobile-settings';

let current: string | null = null;
const listeners = new Set<() => void>();

function setCurrent(stopId: string | null) {
  current = stopId;
  for (const listener of listeners) {
    listener();
  }
}

/**
 * TODO R4c. What was saved, checked like API data (Lesson 5.3's settings): the saved JSON's myStopId
 * when it is a stop id ('s' and two digits); null for anything else, including text that is not JSON.
 */
export function fromSaved(saved: string | null): string | null {
  throw new Error(`TODO R4c: what stop is saved in ${saved}?`);
}

/** TODO R4c. Read the saved stop (AsyncStorage, settingsKey) with fromSaved. Never fails. */
export async function loadMyStop(): Promise<void> {
  throw new Error(`TODO R4c: read My stop from ${settingsKey}`);
}

/** Choose a stop (or null: none): screens update at once. TODO R4c: and the phone saves it. */
export async function changeMyStop(stopId: string | null): Promise<void> {
  setCurrent(stopId);
}

/** My stop outside a component */
export function readMyStop(): string | null {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** My stop's id (null: none yet); the component draws again when it changes */
export function useMyStop(): string | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
