// A crash reporter that hides personal data before a report leaves the phone (Lesson 9.3: "Crash reports are
// personal data"). Reporter is the shape of the course app's reportError seam: setReporter(scrubbing(send)).
export type Reporter = (error: Error, where: string) => void;

const EMAIL = /[^\s@"'<>()=&?]+@[^\s@"'<>()=&?]+\.[a-z]{2,}/gi;
const BEARER = /Bearer\s+[\w.~+/=-]+/g;

export function scrub(text: string): string {
  return text.replace(EMAIL, '[email]').replace(BEARER, 'Bearer [key]');
}

// Send a copy, never the original: the app may still show or rethrow the error it caught
export function scrubbing(send: Reporter): Reporter {
  return (error, where) => {
    const clean = new Error(scrub(error.message));
    clean.name = error.name;
    send(clean, where);
  };
}
