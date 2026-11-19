// Privacy answers from a data inventory (Lesson 9.4, "Privacy Details: What Leaves the Phone"). Both stores define
// "collect" as transmitting data off the device and keeping it longer than the request needs; data processed only
// on the device, or only for the moment of a request, is not collected.
export type DataItem = {
  data: string;
  leavesPhone: boolean; // does the app send it anywhere?
  kept: boolean; // does the receiver keep it after answering the request?
  linkedToAccount: boolean; // is it stored with the volunteer's account?
};

export type Answer = 'not collected' | 'collected, linked to the user' | 'collected, not linked to the user';

// Collected = it leaves the phone AND the receiver keeps it; then: linked to the account or not
export function answerFor(item: DataItem): Answer {
  if (!item.leavesPhone || !item.kept) return 'not collected';
  return item.linkedToAccount ? 'collected, linked to the user' : 'collected, not linked to the user';
}

export function collected(items: DataItem[]): string[] {
  return items.filter((item) => answerFor(item) !== 'not collected').map((item) => item.data);
}

// Apple 5.1.1(v) and Google Play: an app that lets people create an account must let them start deleting it
// (and its data) from inside the app. Google Play also wants a web link. (Build it anyway when it is not required.)
export function deletionInApp(app: { createsAccounts: boolean }): boolean {
  return app.createsAccounts;
}
