// What happens after the picker answers (Take a photo or Choose photos): keep the photos the server
// will take, and say so when one does not fit, while the volunteer can still choose another.
// shoreline-api's POST /api/photos takes JPEG, PNG or WebP photos of 5 MB or smaller.
import type { ImagePickerResult } from 'expo-image-picker';

import type { ItemPhoto } from './types';

export const maxPhotos = 3;
const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxBytes = 5 * 1024 * 1024;

export type Picked = {
  photos: ItemPhoto[]; // the photos the item now has
  problem: string | null; // one sentence when a photo was not added
};

export function addPicked(result: ImagePickerResult, photos: ItemPhoto[]): Picked {
  if (result.canceled) {
    return { photos, problem: null }; // the volunteer closed the camera or the library
  }
  const room = maxPhotos - photos.length;
  const added: ItemPhoto[] = [];
  let refused = 0;
  for (const asset of result.assets.slice(0, room)) {
    // mimeType is the file's kind ('image/heic', 'image/gif'...); type only says photo or video
    const type = asset.mimeType ?? '';
    if (photoTypes.includes(type) && (asset.fileSize ?? 0) <= maxBytes) {
      added.push({ uri: asset.uri, type, photoId: null });
    } else {
      refused += 1;
    }
  }
  const problem =
    refused === 0
      ? null
      : `${refused === 1 ? 'One photo was' : `${refused} photos were`} not added: ` +
        'the server takes JPEG, PNG or WebP photos of 5 MB or smaller.';
  return { photos: [...photos, ...added], problem };
}
