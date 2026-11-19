// Task 3: the volunteer's favorite beaches, kept on the phone with AsyncStorage (one key, a JSON list)
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SiteSummary } from './api';

export type Favorite = Pick<SiteSummary, 'id' | 'name'>;

export const favoritesKey = 'crew-favorites';

// TODO 3a: check what was saved like API data: a list of { id, name } strings, else no favorites (and a
// console.warn when the text is not JSON at all). It never rejects.
export async function readFavorites(): Promise<Favorite[]> {
  const saved = await AsyncStorage.getItem(favoritesKey);
  return saved === null ? [] : (JSON.parse(saved) as Favorite[]);
}
