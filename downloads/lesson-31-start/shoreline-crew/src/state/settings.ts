// The volunteer's settings, kept on the phone with AsyncStorage (new). Small, not secret, and read
// once at startup; every change is saved at once.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

/** 'system' follows the phone's own light or dark setting */
export type ThemeChoice = 'system' | 'light' | 'dark';

export type Settings = {
  theme: ThemeChoice;
  /** Remind me the evening before each cleanup I have a spot at (off until the volunteer says so) */
  remindersOn: boolean;
  /** A short buzz when a sign-up or a debris log goes through (on until the volunteer says no) */
  hapticsOn: boolean;
  /** Less motion in this app, even when the phone's own Reduce Motion is off (off until asked) */
  reduceMotion: boolean;
};

// The key the settings are saved under, as one JSON string
const settingsKey = 'shoreline-crew-settings';

const defaults: Settings = {
  theme: 'system',
  remindersOn: false,
  hapticsOn: true,
  reduceMotion: false,
};
const themeChoices: ThemeChoice[] = ['system', 'light', 'dark'];

let current: Settings = defaults;
const listeners = new Set<() => void>();

function setCurrent(settings: Settings) {
  current = settings;
  for (const listener of listeners) {
    listener();
  }
}

// What was saved is checked like API data: an older version of the app (or a bug) may have
// written something else. Anything unknown falls back to the default.
function fromSaved(saved: string | null): Settings {
  const value: unknown = saved === null ? null : JSON.parse(saved);
  if (typeof value !== 'object' || value === null) {
    return defaults;
  }
  // Each setting on its own: settings saved before a setting existed simply lack it
  const theme = 'theme' in value ? themeChoices.find((choice) => choice === value.theme) : undefined;
  const remindersOn =
    'remindersOn' in value && typeof value.remindersOn === 'boolean' ? value.remindersOn : undefined;
  const hapticsOn =
    'hapticsOn' in value && typeof value.hapticsOn === 'boolean' ? value.hapticsOn : undefined;
  const reduceMotion =
    'reduceMotion' in value && typeof value.reduceMotion === 'boolean'
      ? value.reduceMotion
      : undefined;
  return {
    theme: theme ?? defaults.theme,
    remindersOn: remindersOn ?? defaults.remindersOn,
    hapticsOn: hapticsOn ?? defaults.hapticsOn,
    reduceMotion: reduceMotion ?? defaults.reduceMotion,
  };
}

/** Read the saved settings. Call it once, when the app starts. It never fails. */
export async function loadSettings(): Promise<void> {
  try {
    setCurrent(fromSaved(await AsyncStorage.getItem(settingsKey)));
  } catch (error) {
    console.warn('Could not read the saved settings', error);
  }
}

/** Change some settings: screens update at once, and the phone saves the new values */
export function changeSettings(changes: Partial<Settings>): void {
  setCurrent({ ...current, ...changes });
  AsyncStorage.setItem(settingsKey, JSON.stringify(current)).catch((error: unknown) =>
    console.warn('Could not save the settings', error),
  );
}

/** The current settings, outside a component (a component uses useSettings) */
export function readSettings(): Settings {
  return current;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** The current settings; the component draws again when they change */
export function useSettings(): Settings {
  // The third function is for the web preview's server, which has no saved settings
  return useSyncExternalStore(subscribe, () => current, () => defaults);
}
