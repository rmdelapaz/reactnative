// Task 1: the crew leader's preferences, kept on the phone with AsyncStorage: one key, one small JSON object.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeightUnit = 'kg' | 'lb';

export type Prefs = {
  unit: WeightUnit;
  tipsSeen: boolean;
};

export const prefsKey = 'crew-lab-prefs';
export const defaultPrefs: Prefs = { unit: 'kg', tipsSeen: false };

const units: WeightUnit[] = ['kg', 'lb'];

// What was saved is checked like API data: anything this version does not know becomes the default
function fromSaved(saved: string | null): Prefs {
  const value: unknown = saved === null ? null : JSON.parse(saved);
  if (typeof value !== 'object' || value === null) {
    return defaultPrefs;
  }
  const unit = 'unit' in value ? units.find((known) => known === value.unit) : undefined;
  const tipsSeen = 'tipsSeen' in value && typeof value.tipsSeen === 'boolean' ? value.tipsSeen : undefined;
  return { unit: unit ?? defaultPrefs.unit, tipsSeen: tipsSeen ?? defaultPrefs.tipsSeen };
}

/** The saved preferences, checked. It never rejects: a broken save gives the defaults and a warning. */
export async function loadPrefs(): Promise<Prefs> {
  try {
    return fromSaved(await AsyncStorage.getItem(prefsKey));
  } catch (error) {
    console.warn('Could not read the saved preferences', error);
    return defaultPrefs;
  }
}

/** Change some preferences: merged with what is saved, saved again, and returned */
export async function changePrefs(changes: Partial<Prefs>): Promise<Prefs> {
  const next = { ...(await loadPrefs()), ...changes };
  await AsyncStorage.setItem(prefsKey, JSON.stringify(next));
  return next;
}
