// The web preview's version of photoFiles.ts: a browser has no file system for the app. A picked
// photo stays at the blob: address the browser gave it, which lasts until the page reloads.

/** Nothing to move on the web: read the photo once for its size */
export async function keepPhoto(uri: string): Promise<{ uri: string; bytes: number }> {
  const photo = await (await fetch(uri)).blob();
  return { uri, bytes: photo.size };
}

/** The photo, ready to send, or null when the address no longer works (after a reload) */
export async function readPhoto(uri: string): Promise<Blob | null> {
  try {
    return await (await fetch(uri)).blob();
  } catch {
    return null;
  }
}

/** Let the browser free a blob: photo */
export function forgetPhoto(uri: string): void {
  if (uri.startsWith('blob:')) {
    URL.revokeObjectURL(uri);
  }
}
