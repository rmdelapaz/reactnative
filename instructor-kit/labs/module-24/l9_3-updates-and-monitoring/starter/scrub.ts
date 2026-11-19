// A crash reporter that hides personal data before a report leaves the phone (Lesson 9.3: "Crash reports are
// personal data"). Reporter is the shape of the course app's reportError seam: setReporter(scrubbing(send)).
export type Reporter = (error: Error, where: string) => void;

// TODO 2: replace every email address with [email] and the key after "Bearer " with [key]
export function scrub(text: string): string {
  return text;
}

// TODO 2: return a Reporter that sends a NEW Error (same name, scrubbed message) and the same where
export function scrubbing(send: Reporter): Reporter {
  return send;
}
