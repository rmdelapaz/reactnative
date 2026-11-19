// What happens after the picker answers (Take a photo or Choose photos): keep the photos the server
// will take, and say so when one does not fit, while the volunteer can still choose another.
// shoreline-api's POST /api/photos takes JPEG, PNG or WebP photos of 5 MB or smaller.
import type { ImagePickerResult } from 'expo-image-picker';

import type { ItemPhoto } from './types';

export const maxPhotos = 3;
export const photoTypes = ['image/jpeg', 'image/png', 'image/webp']; // what the API takes
export const maxBytes = 5 * 1024 * 1024;

export type Picked = {
  photos: ItemPhoto[]; // the photos the item now has
  problem: string | null; // one sentence when a photo was not added
};

export function addPicked(result: ImagePickerResult, photos: ItemPhoto[]): Picked {
  if (result.canceled) {
    return { photos, problem: null }; // the volunteer closed the camera or the library
  }
  // TODO (Task 1): the API's rules, and the room that is left
  const added: ItemPhoto[] = [];
  const refused: number = 0;
  for (const asset of result.assets) {
    if (asset.type === 'image') {
      added.push({ uri: asset.uri, type: asset.mimeType ?? 'image/jpeg', photoId: null });
    }
  }
  const problem =
    refused === 0
      ? null
      : `${refused === 1 ? 'One photo was' : `${refused} photos were`} not added: ` +
        'the server takes JPEG, PNG or WebP photos of 5 MB or smaller.';
  return { photos: [...photos, ...added], problem };
}
