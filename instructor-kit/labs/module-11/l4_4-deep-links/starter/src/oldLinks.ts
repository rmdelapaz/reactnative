// Every link from outside the app passes through here before Expo Router reads it: in the course app this
// function would live in src/app/+native-intent.tsx (Lesson 4.4, Exercise 4). Old flyers and QR codes still
// carry addresses the app no longer has.

/** The path to open for an incoming link's path */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  // Last year's flyers: shorelinecrew://event/e08 (cleanups now live at /cleanups/e08)
  const old = /^\/?event\/([^/?#]+)/.exec(path);
  if (old !== null) {
    return `/cleanups/${decodeURIComponent(old[1])}`;
  }
  // TODO 1: last spring's QR codes said shorelinecrew://flyer?cleanup=e17: open /cleanups/e17. An id that is
  // not letters and digits opens '/', and this function must never throw: an error here crashes the app.
  return path;
}
