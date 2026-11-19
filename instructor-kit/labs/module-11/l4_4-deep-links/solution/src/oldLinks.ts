// Every link from outside the app passes through here before Expo Router reads it: in the course app this
// function would live in src/app/+native-intent.tsx (Lesson 4.4, Exercise 4). Old flyers and QR codes still
// carry addresses the app no longer has.

// A cleanup id is letters and digits (e08): anything else in an old link is not one
const cleanupId = /^[a-z0-9]+$/;

/** The path to open for an incoming link's path. Never throws: a strange link opens the first screen. */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  try {
    // Last year's flyers: shorelinecrew://event/e08 (cleanups now live at /cleanups/e08)
    const old = /^\/?event\/([^/?#]+)/.exec(path);
    // Last spring's QR codes: shorelinecrew://flyer?cleanup=e17
    const flyer = /^\/?flyer\?/.test(path)
      ? new URLSearchParams(path.split('?')[1]).get('cleanup')
      : null;
    const raw = old?.[1] ?? flyer;
    if (raw === undefined || raw === null) {
      return path; // not an old address: Expo Router reads it as it is
    }
    const id = decodeURIComponent(raw); // a bad %-escape throws URIError here
    return cleanupId.test(id) ? `/cleanups/${id}` : '/';
  } catch {
    return '/'; // never let a strange link crash the app
  }
}
