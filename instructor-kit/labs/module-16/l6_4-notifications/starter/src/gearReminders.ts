// Reminders to bring borrowed gear back: local notifications, set on the phone for 5 pm the day
// before each loan is due. The phone's own scheduler shows them, with no server and no signal.
import type { NotificationRequestInput } from 'expo-notifications';

import { loanPath } from './taps';
import type { GearLoan } from './types';

// What syncGearReminders needs from the phone. On a phone, pass expo-notifications itself:
// syncGearReminders(Notifications, loans, new Date()). The tests pass a stand-in that keeps the
// requests in memory.
export type ReminderPhone = {
  getAllScheduledNotificationsAsync: () => Promise<{ identifier: string }[]>;
  cancelScheduledNotificationAsync: (identifier: string) => Promise<void>;
  scheduleNotificationAsync: (request: NotificationRequestInput) => Promise<string>;
};

// Every gear reminder's id starts with this, so the app can find its own among the phone's
export const idPrefix = 'gear-';

/** When to remind: 5 pm the day before the loan is due, by the phone's clock */
export function reminderTime(loan: GearLoan): Date {
  // TODO 1: the day before, at 5 pm. (This works... on most days of the month.)
  const [year, month, day] = loan.dueDate.split('-');
  return new Date(`${year}-${month}-${String(Number(day) - 1).padStart(2, '0')}T17:00`);
}

/** The loans worth a reminder, soonest first: still out, and the reminder time still ahead */
export function loansToRemind(loans: GearLoan[], now: Date): GearLoan[] {
  return loans
    .filter((loan) => reminderTime(loan) > now) // TODO 1: which loans need no reminder at all?
    .sort((a, b) => reminderTime(a).getTime() - reminderTime(b).getTime());
}

/**
 * Make the phone's gear reminders match the loans: cancel the ones nobody needs any more, set the
 * rest. Safe to run any time, as often as you like. Never touches a reminder that is not a gear one.
 */
export async function syncGearReminders(phone: ReminderPhone, loans: GearLoan[], now: Date): Promise<void> {
  const wanted = loansToRemind(loans, now);
  const ids = new Set(wanted.map((loan) => idPrefix + loan.id));
  for (const { identifier } of await phone.getAllScheduledNotificationsAsync()) {
    // TODO 2: "start from a clean slate" cancels more than the gear reminders
    if (!ids.has(identifier)) {
      await phone.cancelScheduledNotificationAsync(identifier);
    }
  }
  // Scheduling an id the phone already has replaces that reminder: a new due date gets a new time
  for (const loan of wanted) {
    await phone.scheduleNotificationAsync({
      identifier: idPrefix + loan.id,
      content: {
        title: `Due back tomorrow: ${loan.item}`,
        body: 'Bring it to the gear shed, or tap to see the loan.',
        data: { url: loanPath(loan.id) },
      },
      trigger: reminderTime(loan), // TODO 2: as older examples write it
    });
  }
}
