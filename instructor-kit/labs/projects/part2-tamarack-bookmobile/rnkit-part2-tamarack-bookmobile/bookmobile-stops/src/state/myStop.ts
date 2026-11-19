// "My stop": the stop a patron usually visits, kept on the phone with AsyncStorage (Lesson 5.3).
// Small, not secret, read once at startup; every change is saved at once.
import AsyncStorage from '@react-native-async-storage/async-storage';
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

/** TODO R4c (done). What was saved is checked like API data: anything else means "no stop yet". */
export function fromSaved(saved: string | null): string | null {
  try {
    const value: unknown = saved === null ? null : JSON.parse(saved);
    return typeof value === 'object' &&
      value !== null &&
      'myStopId' in value &&
      typeof value.myStopId === 'string' &&
      /^s\d{2}$/.test(value.myStopId)
      ? value.myStopId
      : null;
  } catch {
    return null; // not JSON at all
  }
}

/** Read the saved stop. Call it once, when the app starts. It never fails. */
export async function loadMyStop(): Promise<void> {
  try {
    setCurrent(fromSaved(await AsyncStorage.getItem(settingsKey)));
  } catch (error) {
    console.warn('Could not read My stop', error);
  }
}

/** Choose a stop (or null: none): screens update at once, and the phone saves it */
export async function changeMyStop(stopId: string | null): Promise<void> {
  setCurrent(stopId);
  try {
    await AsyncStorage.setItem(settingsKey, JSON.stringify({ myStopId: stopId }));
  } catch (error) {
    console.warn('Could not save My stop', error);
  }
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
