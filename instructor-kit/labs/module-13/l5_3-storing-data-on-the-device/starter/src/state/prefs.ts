// Task 1: the crew leader's preferences, kept on the phone with AsyncStorage: one key, one small JSON object.
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WeightUnit = 'kg' | 'lb';

export type Prefs = {
  unit: WeightUnit;
  tipsSeen: boolean;
};

export const prefsKey = 'crew-lab-prefs';
export const defaultPrefs: Prefs = { unit: 'kg', tipsSeen: false };

// TODO 1: what comes out of storage was written by an older version of the app (or a bug), on a phone you have
// never seen. Check it like API data: keep a unit only if it is 'kg' or 'lb', tipsSeen only if it is true or
// false, and fall back to the defaults for anything else, including text that is not JSON at all (warn with
// console.warn when that happens). loadPrefs never rejects.
export async function loadPrefs(): Promise<Prefs> {
  const saved = await AsyncStorage.getItem(prefsKey);
  return saved === null ? defaultPrefs : (JSON.parse(saved) as Prefs);
}

/** Change some preferences: merged with what is saved, saved again, and returned */
export async function changePrefs(changes: Partial<Prefs>): Promise<Prefs> {
  const next = { ...(await loadPrefs()), ...changes };
  await AsyncStorage.setItem(prefsKey, JSON.stringify(next));
  return next;
}
