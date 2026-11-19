// A stand-in for the phone's files (in the app: expo-file-system, Lesson 6.2's photoFiles.ts).
// Under Jest there is no phone: this Map plays the app's documents folder. Like an expo-file-system
// File, what readPhoto gives back is a Blob, ready to be a request body.
const documents = new Map<string, Blob>();

/** Put a photo in the documents folder (the tests do this; in the app, keepPhoto moves the picker's file) */
export function savePhoto(uri: string, photo: Blob): void {
  documents.set(uri, photo);
}

/** The photo, ready to send, or null when the file is gone */
export async function readPhoto(uri: string): Promise<Blob | null> {
  return documents.get(uri) ?? null;
}

/** Delete a kept photo: its item was sent, or the volunteer took it out */
export function forgetPhoto(uri: string): void {
  documents.delete(uri);
}

/** How many photos the documents folder still holds */
export function keptPhotos(): number {
  return documents.size;
}
