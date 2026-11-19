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

// TODO 2: "the app touches it" is not "collected". Which two facts make it collected?
export function answerFor(item: DataItem): Answer {
  return item.linkedToAccount ? 'collected, linked to the user' : 'collected, not linked to the user';
}

export function collected(items: DataItem[]): string[] {
  return items.filter((item) => answerFor(item) !== 'not collected').map((item) => item.data);
}

// TODO 2: both stores' account-deletion rule starts with the same condition (Lesson 9.4)
export function deletionInApp(app: { createsAccounts: boolean }): boolean {
  return false;
}
