// The photos a volunteer adds to a debris log, as files on this phone (new). The picker leaves each
// photo in the app's cache, which the phone may empty when storage runs low. A log can wait days
// for a signal, so its photos move into the app's documents until the log is sent.
import { randomUUID } from 'expo-crypto';
import { Directory, File, Paths } from 'expo-file-system';

const folder = new Directory(Paths.document, 'log-photos');

/** Move a picked photo out of the cache into the app's documents: where it is now, and its size */
export async function keepPhoto(uri: string): Promise<{ uri: string; bytes: number }> {
  folder.create({ idempotent: true }); // no error when the folder is already there
  const photo = new File(uri);
  await photo.move(new File(folder, `${randomUUID()}${photo.extension}`)); // photo.uri changes
  return { uri: photo.uri, bytes: photo.size };
}

/** The photo, ready to send (expo-file-system's File is a Blob), or null when the file is gone */
export async function readPhoto(uri: string): Promise<Blob | null> {
  const photo = new File(uri);
  return photo.exists ? photo : null;
}

/** Delete a kept photo: its log was sent, or the volunteer took it out */
export function forgetPhoto(uri: string): void {
  const photo = new File(uri);
  if (photo.exists) {
    photo.delete();
  }
}
