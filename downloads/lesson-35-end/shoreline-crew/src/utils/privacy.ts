// What Shoreline Crew does with a volunteer's data (Lesson 9.4), in the app's own words. The Your data
// screen shows it, and the stores' privacy forms are answered from the same facts: when the app
// changes what it sends, change this file, then the forms.

export type DataFact = { what: string; detail: string };

// Sent to the crew's server (the address in EXPO_PUBLIC_API_URL) and kept there, with your account
export const sentToServer: DataFact[] = [
  {
    what: 'Your email address and password',
    detail: 'When you sign in. The server answers with your name, your role and a sign-in key.',
  },
  {
    what: 'Your sign-ups',
    detail: "The cleanups you join or cancel, and the day's code when you check in.",
  },
  {
    what: 'Your debris logs',
    detail: 'The counts, bags, weight, note and time of each log you send.',
  },
  {
    what: 'Photos you add to a log',
    detail: 'Only the photos you take or pick for it.',
  },
];

// Kept on this phone, never sent
export const keptOnPhone: DataFact[] = [
  {
    what: 'Your location',
    detail: 'Only while you look at a cleanup, to show how far away it is and where you are.',
  },
  {
    what: 'Your sign-in key',
    detail: "In the phone's secure storage, until you sign out.",
  },
  {
    what: 'Logs that are not sent yet',
    detail: 'With their photos, until they reach the server or you remove them.',
  },
  {
    what: 'Your logbook and settings',
    detail: 'Your sent logs, and your theme, reminder, vibration and motion choices.',
  },
  {
    what: 'Reminders',
    detail: 'The phone schedules them itself. No server sends them.',
  },
];

export const notCollected = 'No ads, no analytics, no tracking, and no crash reports.';

// Both stores ask for these pages on the web, and for a way to reach them from inside the app.
// Replace them with your own pages before a store release: a link that goes nowhere is a rejection.
export const privacyPolicyUrl = 'https://shorelinecrew.example.org/privacy';
export const accountDeletionUrl = 'https://shorelinecrew.example.org/delete-account';
