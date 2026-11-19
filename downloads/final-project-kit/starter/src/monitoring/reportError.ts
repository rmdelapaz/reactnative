// Where the app sends the errors it did not expect (Lesson 9.3). Today: the developer's
// terminal while developing, nothing in a build. A crash-reporting service plugs in with
// setReporter, once, at startup: no screen has to change.
export type Reporter = (error: Error, where: string) => void;

const developerConsole: Reporter = (error, where) => {
  if (__DEV__) console.warn(`[${where}] ${error.name}: ${error.message}`);
};

let reporter: Reporter = developerConsole;

export function setReporter(next: Reporter): void {
  reporter = next;
}

// Anything can be thrown in JavaScript, not only Errors: turn it into one before reporting it
export function reportError(thrown: unknown, where: string): void {
  const error = thrown instanceof Error ? thrown : new Error(String(thrown));
  try {
    reporter(error, where);
  } catch {
    // A broken reporter must never crash the app it reports on
  }
}
