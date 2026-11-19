// Task 3: the volunteer's favorite beaches, kept on the phone with AsyncStorage (one key, a JSON list)
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SiteSummary } from './api';

export type Favorite = Pick<SiteSummary, 'id' | 'name'>;

export const favoritesKey = 'crew-favorites';

function isFavorite(value: unknown): value is Favorite {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

/** The saved favorites, checked: anything this version cannot read means no favorites. It never rejects. */
export async function readFavorites(): Promise<Favorite[]> {
  try {
    const saved = await AsyncStorage.getItem(favoritesKey);
    const value: unknown = saved === null ? [] : JSON.parse(saved);
    return Array.isArray(value) ? value.filter(isFavorite) : [];
  } catch (error) {
    console.warn('Could not read the saved favorites', error);
    return [];
  }
}
